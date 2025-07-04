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

        stage('Verificar Node.js') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Instalar dependencias del frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Construir frontend') {
            steps {
                dir('frontend') {
                    withEnv(["VITE_API_HOST=${env.VITE_API_HOST}", "VITE_ENV=${env.VITE_ENV}"]) {
                        bat 'npm run build -- --mode test'
                    }
                }
            }
        }

        stage('Servir frontend en segundo plano') {
            steps {
                dir('frontend') {
                    bat 'start /B npx serve -s dist -l 5000'
                }
            }
        }

        stage('Esperar frontend') {
            steps {
                bat 'npx wait-on http://localhost:5000'
            }
        }

        stage('Instalar selenium-side-runner') {
            steps {
                bat 'npm install -g selenium-side-runner'
            }
        }

        stage('Ejecutar pruebas con Selenium IDE') {
            steps {
                dir('test') {
                    bat """
                        selenium-side-runner main-test.side ^
                        --base-url ${env.TEST_URL} ^
                        --output-directory=./results ^
                        --output-format=jest ^
                        --headless
                    """
                }
            }
        }

        stage('Publicar resultados') {
            steps {
                junit 'test/results/*.xml'
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
