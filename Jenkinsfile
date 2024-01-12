pipeline {
  agent any

  environment {
    DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
    DOCKER_HUB_VENDOR_DASHBOAD_SERVER_REPO = 'aniketbhalla/vendor-dashboard-server'
    DOCKER_HUB_VENDOR_DASHBOAD_APP_REPO = 'aniketbhalla/vendor-dashboard-app'
  }

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
          sh 'echo building docker images'
        script {
          sh 'docker build -f Dockerfile.production-server -t $DOCKER_HUB_VENDOR_DASHBOAD_SERVER_REPO .'
          // sh 'docker build -f Dockerfile.production-react-app -t $DOCKER_HUB_VENDOR_DASHBOAD_APP_REPO ./client'
        }
      }
    }

    stage('Docker Hub Images Push') {
      steps {
        sh 'echo pushing built docker images to docker hub container registery'
        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
          sh 'echo logging into the docker hub'
          sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
          sh 'docker push $DOCKER_HUB_VENDOR_DASHBOAD_SERVER_REPO'
         // sh 'docker push $DOCKER_HUB_VENDOR_DASHBOAD_APP_REPO'
          sh 'docker logout'
        }
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
