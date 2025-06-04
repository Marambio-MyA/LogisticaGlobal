pipeline {
    agent any

    environment {
        VITE_API_HOST = credentials('VITE_API_HOST')       // Usar Jenkins Credentials
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

        stage('Setup Node.js') {
            steps {
                // Usa Node.js desde una herramienta instalada o contenedor con Node.js 20
                sh 'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -'
                sh 'sudo apt-get install -y nodejs'
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    withEnv(["VITE_API_HOST=${env.VITE_API_HOST}", "VITE_ENV=${env.VITE_ENV}"]) {
                        sh 'npm run build -- --mode test'
                    }
                }
            }
        }

        stage('Serve Frontend in Background') {
            steps {
                dir('frontend') {
                    sh 'nohup npx serve -s dist -l 5000 &'
                }
            }
        }

        stage('Wait for Frontend') {
            steps {
                sh 'npx wait-on http://localhost:5000'
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
                        sh 'npm install'
                        sh 'node main-test.js'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
    }
}
