pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "ananyashetty012/todolist:v1"
        DOCKER_CREDENTIAL_ID = "ananyagshetty7-dockerhub-creds"
        KUBE_NAMESPACE = "ananya-ns"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Ananyashetty7/todolist.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([ credentialsId: "$DOCKER_CREDENTIAL_ID", url: "" ]) {
                    sh 'docker push $DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f deployment.yaml'
            }
        }

        stage('Get Service URL') {
            steps {
                sh 'kubectl get svc -n $KUBE_NAMESPACE'
            }
        }
    }
}
