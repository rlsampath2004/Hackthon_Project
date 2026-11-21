FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml mvnw mvnw.cmd ./
COPY .mvn ./.mvn
RUN chmod +x ./mvnw
COPY src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/finwise-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=${PORT}"]

