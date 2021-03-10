# aws-training-management-system

## Git Hub Rule

1. Please name your local branch to be able to understand who was developed.

   ```
   sample: 
   [pagename]-[purpose]-[your name]
   ```

2. You must push with  **pull request** and set reviewer to review when you changed source code. 

3. for development, you may  use **develop** branch

   ```bash
   ## how to pull develop branch on your local branch
   git checkout master ##switch branch to master
   git pull ##fetch remote branch
   git branch -a ##check all branch on remote&local
   git checkout -b [new branch name] origin/develop ##fetch develop branch to local branch named [new branch name]
   ```

4. You must push just code be able to compile. before you push your code, please merge recent develop branch on your local branch and check if working correctly.

   

--------------------



## Developer Guide

### 1. Set up development environment

1-1. Install Latest Nodejs(version 6.x and 8.x both fine) from https://nodejs.org, you should be able to run `node -v` and check its version.

1-2. Install Development Tools [visual studio code] from 
https://code.visualstudio.com/download

1-3. Install MySQL client tools [sequelpro] from 
https://sequelpro.com/download
please use whatever you like, (e.g. DBeaver, TablePlus, ...)

### 2. Import Backend codes from git

2-1. Clone sourcecodes from github.

backend
https://github.com/vanessadizon/nodejs_training_skill_management_service.git

2-2. Installing Package dependencies of backend

```bash
cd server
npm install
```

### 3. Run Backend Service server

Run express server as service provider 

npm run dev
