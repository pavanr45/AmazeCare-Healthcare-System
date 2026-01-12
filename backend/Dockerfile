FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /build

COPY backend/pom.xml .
COPY backend/.mvn .mvn
COPY backend/mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline

COPY backend/src src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 8080
CMD ["java","-jar","app.jar"]
