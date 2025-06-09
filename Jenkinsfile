pipeline {
    agent any

    environment {
        VITE_API_HOST = credentials('VITE_API_HOST')
        VITE_ENV = credentials('VITE_ENV')
        TEST_URL = credentials('TEST_URL') // Ej: http://localhost:5000
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
                    withEnv([
                        "VITE_API_HOST=${env.VITE_API_HOST}",
                        "VITE_ENV=${env.VITE_ENV}"
                    ]) {
                        bat 'npm run build -- --mode test'
                    }
                }
            }
        }

        stage('Serve Frontend (Background)') {
            steps {
                dir('frontend') {
                    bat 'start "serve" cmd /c "npx serve -s dist -l 5000"'
                }
                // Espera unos segundos para que el servidor arranque
                bat 'timeout /t 3'
            }
        }

        stage('Verificar servidor') {
            steps {
                bat 'curl http://localhost:5000'
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
        always {
            echo 'Pipeline finished.'
        }
    }
}
