# Build stage
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy poms first for caching
COPY algorithms/pom.xml ./algorithms/
COPY backend/pom.xml ./backend/

# Build algorithms first
COPY algorithms/src ./algorithms/src
RUN mvn install -f algorithms/pom.xml -DskipTests

# Build backend
COPY backend/src ./backend/src
RUN mvn package -f backend/pom.xml -DskipTests

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
