#!/usr/bin/env groovy

pipeline {
  agent any

  environment {
  }

  stages {
    stage('Build') {
      steps {
        echo "docker images built"
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
      echo 'The build is completed! Sent notification to Slack.'
    }
  }
}
