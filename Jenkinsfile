pipeline {
  agent any

  tools {
    nodejs 'nodejs'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Deployed'
      }
    }
  }

  post {
    always {
      echo 'The build is completed!'
    }
  }
}
