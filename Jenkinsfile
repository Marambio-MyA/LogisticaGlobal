pipeline {
    agent any

    environment {
        VITE_API_HOST = credentials('VITE_API_HOST')
        VITE_ENV = credentials('VITE_ENV')
        TEST_URL = credentials('TEST_URL')
        TEST_EMAIL = credentials('TEST_EMAIL')
        TEST_PASSWORD = credentials('TEST_PASSWORD')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js (omitido en Windows si ya está instalado)') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    withEnv(["VITE_API_HOST=${env.VITE_API_HOST}", "VITE_ENV=${env.VITE_ENV}"]) {
                        bat 'npm run build -- --mode test'
                    }
                }
            }
        }

        stage('Serve Frontend in Background') {
            steps {
                dir('frontend') {
                    bat 'start /B npx serve -s dist -l 5000'
                }
            }
        }

        stage('Wait for Frontend') {
            steps {
                bat 'npx wait-on http://localhost:5000'
            }
        }

        stage('Run Puppeteer Tests') {
            steps {
                dir('test') {
                    withEnv([
                        "TEST_URL=${env.TEST_URL}",
                        "TEST_EMAIL=${env.TEST_EMAIL}",
                        "TEST_PASSWORD=${env.TEST_PASSWORD}"
                    ]) {
                        bat 'npm install'
                        bat 'node main-test.js'
                    }
                }
            }
        }
    }

    post {
        success {
            slackSend(channel: '#jenkins-notif', message: "✅ *Build OK:* `${env.JOB_NAME}` #${env.BUILD_NUMBER}\n${env.BUILD_URL}")
            githubNotify context: 'Jenkins CI', status: 'SUCCESS', description: 'Build passed', targetUrl: "${env.BUILD_URL}"
        }
        failure {
            slackSend(channel: '#jenkins-notif', message: "❌ *Build FAILED:* `${env.JOB_NAME}` #${env.BUILD_NUMBER}\n${env.BUILD_URL}")
            githubNotify context: 'Jenkins CI', status: 'FAILURE', description: 'Build failed', targetUrl: "${env.BUILD_URL}"
        }
        always {
            echo 'Pipeline finished.'
        }
    }

}
