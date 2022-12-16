Key Application Domains
=======================
Membership -> SHALL be developed as one lambda function and the proper cognito user pool.
  - Users
  - Companies
  - Accounts
  - Licenses

Sales -> SHALL be developed as one lambda function.
  - Invoicing
  - Billing
  - Payments
  - Packages

 Jobs -> SHALL be developed as one lambda function
  - Queue

Files -> SHALL be developed as one lambda function.
  - Upload (S3 Signed)

Integrations
  - Quickbooks -> SHALL be developed as one lambda function for the HTTP API and another one for the workers. Worker SHALL receive their tasks using a SQS Queue.
    - Company OAuth
    - Bulk Api Manager
    - API Calls for inserting: -> Workers!
      - Accounts
      - Locations
      - Classes
      - Products and Services
      - Customers
      - Vendors
      - Employees
      - Bank Statement
      - Bills
      - Bill Payments
      - Checks
      - Credit Card Changes
      - Credit Memos
      - Deposits
      - Estimates
      - Invoices
      - Journal Entries
      - Purchase Orders
      - Purchase - Cash
      - Receive Payments
      - Refund Receipts
      - Sales Receipts
      - Transfers
      - Time Activities
      - Vendor Credits
	- Salesforce -> SHALL be developed as one lambda function for the HTTP API and another one for the workers. Worker SHALL receive their tasks using a SQS Queue.
	- Link salesforce to company -> HTTP API
	- Workers:
	  - CreditMemos
	  - Estimates
	  - Invoices
	  - Items
	  - Refunds
	  - SalesReceipts
	  - Customers

Key Architecture Decisions
==========================

Frontend
--------

The project SHALL use webflow UI for frontend. The UI will be served direcly by webflow.
Application state SHALL be represented as one immutable object, state SHALL be altered using action thunks. 
Aplication interface changes may listen to thunk result, whereas a copy of the state will also be provided. 
Application interface and event dependency SHALL be explicitly coded.
Console.warn SHALL be used for an event that targets a element that cannot be found the the current page.
The complete custom js code SHALL be included as a minified global js.
Remote state change (ie. when a job is processing and then completes) will be reported as polling based.

Backend
-------

One SHALL use 2 lambda layers, one for the workers and one for the http services. The http services will be provided behind an API Gateway. All logging SHALL be forwarded to the proper cloudwatch channels. 

Integration credential storage IS THE MOST VULNERABLE POINT IN THE SYSTEM (leaking this data WILL compromise the client's companies accounting system!) and, thus, SHALL use an AES256 field level encription key, which SHALL be kept encrypted along the row. One SHALL use the KMS encryption to decrypt the key and, then, decrypt the data. Encrypted/decrypted key or credentials SHALL NOT appear in log messages NOR be transfered to the frontend.

User uploaded files and user content derivated files (ie: files containing the returned errors), SHALL be kept in S3 using per-file encryption key (KMS-SSE).

Endpoints SHALL allow versioning as in /domain/version/specific-endpoint and /domain/specifc-endpoind SHALL point to the newest version.

Endpoints SHALL respect the following composition exceptionHandler( logInjector( pipe( auth2, validador, controller, service, access ) ) ) where the following recommendations apply:

	- auth SHALL check JWT integrity and proper resource access policy
	- validator SHALL check payload format, using json-schema as in ajv or yup
	- controller SHALL validate request agains business rules (other than authorization) and provide the unit of work context to the service calls (usually one or more database transaction handles)
	- service SHALL perform the business operations and pass the context down to the respective access layers
	- access layer SHALL perform data persistency in a atomic manner given the context
	
All schema-definitions SHALL reside in a toplevel project. Schemas are cross-domain entities.

Database
--------

Database SHALL rely on PostgreSQL RDS using proper RDS proxy. Each domain should define its own schema. Consistency between schemas should be eventual, as in, foreign keys SHALL NOT cross schemas. 
All tables SHALL contain the following fields company_id, created_at, deleted_at, updated_at and created_by. Entities that need status tracking/versioning SHALL employ a entity_versioning auxiliary table so that the unit of work will atomically insert the new version into the entity table and the versioning table.

BI
--
BI SHALL be provided by Metabase Cloud.
Dashboards SHALL be provided by Metabase Cloud embbedded charts using a AWS Lambda to retain key exchange.
