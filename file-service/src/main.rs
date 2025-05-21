use axum::{routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs;
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[derive(Debug, Deserialize)]
struct FileOperationRequest {
    operation: String,
    payload: String,
}

#[derive(Serialize)]
struct FileOperationResponse {
    status: String,
    operation: String,
    payload: String,
}

async fn file_operation_handler(
    Json(req): Json<FileOperationRequest>,
) -> Json<FileOperationResponse> {
    let mut status = "ok".to_string();
    let mut result_payload = String::new();
    let op = req.operation.as_str();
    // Fix: Unwrap double-encoded JSON if present
    let mut payload: Value = serde_json::from_str(&req.payload).unwrap_or(Value::Null);
    if let Value::String(s) = &payload {
        // If payload is still a string, parse again
        payload = serde_json::from_str(s).unwrap_or(Value::Null);
    }
    match op {
        "create" => {
            if let Some(path) = payload.get("path").and_then(|v| v.as_str()) {
                match fs::File::create(path) {
                    Ok(_) => status = "created".to_string(),
                    Err(e) => {
                        status = "error".to_string();
                        result_payload = format!("{}\n{:?}", e, e);
                    }
                }
            } else {
                status = "error".to_string();
                result_payload = "Missing 'path' in payload".to_string();
            }
        }
        "read" => {
            if let Some(path) = payload.get("path").and_then(|v| v.as_str()) {
                match fs::read_to_string(path) {
                    Ok(content) => result_payload = content,
                    Err(e) => {
                        status = "error".to_string();
                        result_payload = format!("{}\n{:?}", e, e);
                    }
                }
            } else {
                status = "error".to_string();
                result_payload = "Missing 'path' in payload".to_string();
            }
        }
        "update" => {
            if let (Some(path), Some(content)) = (
                payload.get("path").and_then(|v| v.as_str()),
                payload.get("content").and_then(|v| v.as_str()),
            ) {
                match fs::write(path, content) {
                    Ok(_) => status = "updated".to_string(),
                    Err(e) => {
                        status = "error".to_string();
                        result_payload = format!("{}\n{:?}", e, e);
                    }
                }
            } else {
                status = "error".to_string();
                result_payload = "Missing 'path' or 'content' in payload".to_string();
            }
        }
        "delete" => {
            if let Some(path) = payload.get("path").and_then(|v| v.as_str()) {
                match fs::remove_file(path) {
                    Ok(_) => status = "deleted".to_string(),
                    Err(e) => {
                        status = "error".to_string();
                        result_payload = format!("{}\n{:?}", e, e);
                    }
                }
            } else {
                status = "error".to_string();
                result_payload = "Missing 'path' in payload".to_string();
            }
        }
        "move" => {
            if let (Some(from), Some(to)) = (
                payload.get("from").and_then(|v| v.as_str()),
                payload.get("to").and_then(|v| v.as_str()),
            ) {
                match fs::rename(from, to) {
                    Ok(_) => status = "moved".to_string(),
                    Err(e) => {
                        status = "error".to_string();
                        result_payload = format!("{}\n{:?}", e, e);
                    }
                }
            } else {
                status = "error".to_string();
                result_payload = "Missing 'from' or 'to' in payload".to_string();
            }
        }
        "copy" => {
            if let (Some(from), Some(to)) = (
                payload.get("from").and_then(|v| v.as_str()),
                payload.get("to").and_then(|v| v.as_str()),
            ) {
                match fs::copy(from, to) {
                    Ok(_) => status = "copied".to_string(),
                    Err(e) => {
                        status = "error".to_string();
                        result_payload = format!("{}\n{:?}", e, e);
                    }
                }
            } else {
                status = "error".to_string();
                result_payload = "Missing 'from' or 'to' in payload".to_string();
            }
        }
        "rename" => {
            if let (Some(from), Some(to)) = (
                payload.get("from").and_then(|v| v.as_str()),
                payload.get("to").and_then(|v| v.as_str()),
            ) {
                match fs::rename(from, to) {
                    Ok(_) => status = "renamed".to_string(),
                    Err(e) => {
                        status = "error".to_string();
                        result_payload = format!("{}\n{:?}", e, e);
                    }
                }
            } else {
                status = "error".to_string();
                result_payload = "Missing 'from' or 'to' in payload".to_string();
            }
        }
        "list" => {
            if let Some(path) = payload.get("path").and_then(|v| v.as_str()) {
                match fs::read_dir(path) {
                    Ok(entries) => {
                        let mut names = vec![];
                        for entry in entries {
                            match entry {
                                Ok(e) => names.push(e.file_name().to_string_lossy().to_string()),
                                Err(e) => names.push(format!("ERROR: {:?}", e)),
                            }
                        }
                        result_payload = serde_json::to_string(&names).unwrap_or_default();
                    }
                    Err(e) => {
                        status = "error".to_string();
                        result_payload = format!("{}\n{:?}", e, e);
                    }
                }
            } else {
                status = "error".to_string();
                result_payload = "Missing 'path' in payload".to_string();
            }
        }
        _ => {
            status = "error".to_string();
            result_payload = format!("Unknown operation: {}", op);
        }
    }
    Json(FileOperationResponse {
        status,
        operation: req.operation,
        payload: result_payload,
    })
}

#[tokio::main]
async fn main() {
    let app = Router::new().route("/file-operation", post(file_operation_handler));
    let addr = SocketAddr::from(([127, 0, 0, 1], 8082));
    println!("Rust file service listening on {}", addr);
    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
