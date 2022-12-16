Monorepo Structure
=================
The monorepo uses yarn workspaces and it’s compatible with the node 17+ runtime.

Lib are projects identified by the “lib” prefix. A lib project SHALL NOT produce deployable artifacts.

Backend projects are identified by the “backend” prefix. A backend project SHALL produce an AWS Lambda deployable artifact compatible with API Gateway HTTP endpoints. 

Worker projects identifies by the “workers” prefix. A backend project SHALL produce an AWS Lambda deployable artifact compatible with SQS task delivery.

The terraform project, which describes the environment and artifact deployment.

The docker-compose.yml which provides a docker based cluster for running the project locally using the docker compose up command.


Branching Model and Workflow
==========================

Reserved Branches
-------------------------
The following branches are reserved: main, qa, dev, prod. Code committed to this branches WILL trigger the CI/CD pipeline to deploy to the respective environment. 

Feature Branches
-----------------------
Feature branches SHALL be named “feature/:jira_id/:feature_name”. The developer of a feature branch SHALL merge any changes from upstream reserved branches to the feature branch BEFORE requesting a pull request into the reserved branch.

Feature branches’ commits SHALL NOT be squashed.
Feature branches SHALL NOT be rebased.

A feature branch SHOULD modify only one of the monorepo projects.

Fixes
------
Fixes are changes that will be applied directly into the production branch. 

Fix branches SHALL be named “fix/:jira_bug_id/:fix_description”. 
Fix branches SHALL be based on the current production commit, as in, the last commit that was deployed successfully using the CI/CD pipeline.
The developer of a fix branch SHALL merge any changes from upstream reserved branches to the feature branch BEFORE requesting a pull request into the production branch.

Fix branches’ commits SHALL NOT be squashed.
Fix branches SHALL NOT be rebased.


