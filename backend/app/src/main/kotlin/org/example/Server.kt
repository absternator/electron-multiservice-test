package org.example

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

fun startServer() {
    val client =
            HttpClient(CIO) {
                install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json() }
            }
    embeddedServer(Netty, port = 8081) {
                install(ContentNegotiation) { json() }
                routing {
                    post("/file-operation") {
                        val req = call.receive<FileOperationRequest>()
                        val rustResponse: String =
                                client
                                        .post("http://localhost:8082/file-operation") {
                                            contentType(ContentType.Application.Json)
                                            setBody(req)
                                        }
                                        .bodyAsText()
                        call.respondText(rustResponse, ContentType.Application.Json)
                    }
                }
            }
            .start(wait = true)
}

@Serializable data class FileOperationRequest(val operation: String, val payload: String)

@Serializable
data class FileOperationResponse(val status: String, val operation: String, val payload: String)
