# Stage 1: Build the application using Maven
FROM maven:3.8.5-openjdk-17 AS builder

WORKDIR /app

# Copy only the pom.xml to leverage cached dependencies
COPY pom.xml .
# Download dependencies (cached if pom.xml hasn't changed)
RUN mvn dependency:go-offline

# Copy the source code and build the jar (skipping tests)
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final runtime image
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the jar file from the builder stage into the runtime image
COPY --from=builder /app/target/lionride-backend-0.0.1-SNAPSHOT.jar .

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Set the active Spring profile; default to production (override with environment variables as needed)
ENV SPRING_PROFILES_ACTIVE=prod

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/lionride-backend-0.0.1-SNAPSHOT.jar"]
