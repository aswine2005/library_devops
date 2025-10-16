pipeline {
  agent any

  environment {
    REPO_URL = 'https://github.com/aswine2005/library_devops.git'
    BRANCH = 'main'
    DEPLOY_DIR = '/var/www/html'
  }

  stages {
    stage('Checkout') {
      steps {
        echo '📥 Cloning repository...'
        git branch: "${BRANCH}", url: "${REPO_URL}"
      }
    }

    stage('Install Dependencies') {
      steps {
        echo '📦 Installing npm dependencies...'
        sh 'npm ci --unsafe-perm'
      }
    }

    stage('Build React App') {
      steps {
        echo '🏗️ Building React app...'
        sh 'npm run build'
      }
    }

    stage('Deploy to EC2 (Nginx)') {
      steps {
        echo '🚀 Deploying to /var/www/html...'
        sh """
          sudo rm -rf ${DEPLOY_DIR}/*
          sudo cp -r dist/* ${DEPLOY_DIR}/
          sudo chown -R www-data:www-data ${DEPLOY_DIR}
        """
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline succeeded: build & deploy done.'
    }
    failure {
      echo '❌ Pipeline failed — check console output.'
    }
  }
}

