pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo '📥 Cloning repository...'
                git branch: 'main', url: 'https://github.com/aswine2005/library_devops.git'
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
                echo '🏗️ Building project...'
                sh 'npm run build'
            }
        }

        stage('Deploy to EC2 (Nginx)') {
            steps {
                echo '🚀 Deploying to /var/www/html...'
                sh '''
                    sudo rm -rf /var/www/html/*
                    sudo cp -r build/* /var/www/html/
                '''
            }
        }

        stage('Post-Build') {
            steps {
                echo '✅ Deployment completed successfully!'
            }
        }
    }
}
