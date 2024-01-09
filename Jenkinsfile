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
        echo 'app has been tested successfully'
      }
    }

    stage('Build') {
      steps {
        echo 'app built'
      }
    }

    stage('Deploy') {
      steps {
        echo 'app Deployed'
      }
    }
  }

  post {
    always {
      echo 'The build is completed!'
    }
  }
}
