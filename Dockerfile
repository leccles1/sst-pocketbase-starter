# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /build

# Copy only the necessary files for building
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the binary with optimizations
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o pocketbase \
    ./app/cmd

# Final stage
FROM alpine:latest

# Add CA certificates for HTTPS
RUN apk --no-cache add ca-certificates

WORKDIR /pb

# Copy only the binary from builder
COPY --from=builder /build/pocketbase .

# Uncomment if needed:
# COPY ./pb_migrations ./pb_migrations
# COPY ./pb_hooks ./pb_hooks

VOLUME /pb/pb_data
EXPOSE 8080

# Use non-root user for security
RUN adduser -D -g '' appuser
USER appuser

CMD ["./pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data"]