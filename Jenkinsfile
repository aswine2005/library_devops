pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/aswine2005/library_devops.git'
        BRANCH   = 'main'
        DEPLOY_DIR = '/var/www/html'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📥 Cloning repository...'
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install --unsafe-perm'
            }
        }

        stage('Build React App') {
            steps {
                echo '🏗️ Building React project...'
                sh 'npm run build'
            }
        }

        stage('Deploy to EC2 (Nginx)') {
            steps {
                echo '🚀 Deploying build to /var/www/html...'
                sh '''
                    sudo rm -rf /var/www/html/*
                    sudo cp -r build/* /var/www/html/
                    sudo chown -R www-data:www-data /var/www/html
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Deployment completed successfully!'
        }
        failure {
            echo '❌ Build or deployment failed — check Jenkins logs.'
        }
    }
}

