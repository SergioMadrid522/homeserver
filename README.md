# AMCloud Server

Self-hosted private cloud storage platform inspired by services such as OneDrive and Google Drive.

The project provides a web-based file management system with authentication, folder and file management, dedicated physical storage, automated backups, and a server administration CLI.

> **Status:** Active Development
> Deployment is not yet available. The system is currently being developed locally/on the server.

---

## Overview

The Home Server is designed as a self-hosted private cloud where users can manage their files and folders through a web interface while the server administrator can manage the underlying system through a dedicated Bash CLI.

The project is divided into several independent components:

* Web frontend
* Backend API
* Database
* Physical storage
* Authentication
* Backup automation
* Server management CLI
* Deployment infrastructure

The main architectural idea is to separate **logical file organization** from the **physical storage layer**.

Users interact with normal folder and file names, while physical files are stored using UUID-based identifiers such as `storageName`.

---

# Architecture

```text

                  HOME SERVER                                       ┌─────────────────┐
                      │                                             │ Backup          |
┌─────────────────────┼─────────────────────┐                       | Automation with │
│                     │                     │                       │ Python          │
▼                     ▼                     ▼                       │                 │
Frontend           Backend              Management                  │ cron → 03:00 AM │
Next.js             NestJS                 CLI                      └────────┬────────┘ 
                      │                    Bash                              │                      
        ┌─────────────┼─────────────┐       │                                ▼  
        │             │             │       │                             Backups
        ▼             ▼             ▼       │
    PostgreSQL    HDD Storage     Auth      │
    + Prisma      UUID files                │
                                           SSH
                                            │
                                            ▼
                                      Debian Server
                                      
```

---

# Project Structure

```text

HOME SERVER
    │
    ├── Frontend
    │       └── Next.js
    │
    ├── Backend
    │     └── NestJS
    │           ├── Authentication
    │           ├── Users
    │           ├── Folders
    │           ├── Files
    │           ├── Uploads
    │           └── Downloads
    │                   ├── Single file
    │                   ├── Multiple files → ZIP
    │                   └── Folder → ZIP
    │
    ├── Database
    │       └── PostgreSQL + Prisma
    │                   ├── Users
    │                   ├── Folders
    │                   ├── Files
    │                   └── Metadata
    │
    ├── Storage
    │      └── Dedicated HDD
    │              └── Physical files
    │                        └── UUID / storageName
    │
    ├── Authentication
    │         ├── Email verification
    │         └── SMS / phone notifications
    │                     ├── Storage limit warning
    │                     └── Storage limit reached
    │
    ├── Backup Automation
    │         └── Python / Bash
    │                   ├── Scheduled → 03:00 AM
    │                   ├── Create backups
    │                   ├── Verify backups
    │                   └── Backup retention
    │
    ├── Management CLI
    │         └── Bash → SSH
    │                 ├── System Status
    │                 │         ├── CPU
    │                 │         ├── RAM
    │                 │         ├── Storage
    │                 │         ├── Uptime
    │                 │         └── Network
    │                 │
    │                 ├── Storage
    │                 │     ├── Disk usage
    │                 │     ├── Directories
    │                 │     └── Available space
    │                 │
    │                 ├── Logs
    │                 │    ├── System logs
    │                 │    └── Service logs
    │                 │
    │                 ├── Backups
    │                 │      ├── List backups
    │                 │      └── Total backups
    │                 │
    │                 ├── Services
    │                 │       ├── NestJS
    │                 │       └── PostgreSQL
    │                 │
    │                 ├── SSH
    │                 │    └── Interactive shell
    │                 │
    │                 └── Maintenance
    │                          ├── Update application
    │                          └── Cleanup
    │
    └── Deployment
            ├── Local network
            └── Public access

```

---

# Frontend

The frontend is built with **Next.js**.

It provides the user-facing interface for interacting with the Home Server.

Planned/responsible areas include:

* Authentication interface
* Folder navigation
* File management
* Uploads
* Downloads
* Favorites
* Trash
* Storage information
* Responsive interface

The UI and responsive implementation are still pending.

---

# Backend

The backend is built with **NestJS + TypeScript**.

The API is responsible for application logic, authentication, database communication, filesystem interaction, uploads, and downloads.

## Backend Modules

```text

NestJS
  │
  ├── Authentication
  ├── Users
  ├── Folders
  ├── Files
  ├── Uploads
  └── Downloads
          ├── Single file
          ├── Multiple files → ZIP
          └── Folder → ZIP

```

The backend uses **Node.js streams** for file-related operations where appropriate.

---

# Database

The project uses:

* PostgreSQL
* Prisma ORM

The database stores the logical representation of the user's files and folders.

```text

PostgreSQL
    │
    ├── Users
    ├── Folders
    ├── Files
    └── Metadata

```

The database represents the logical structure while the physical filesystem stores the actual data.

---

# Storage Architecture

One of the main architectural characteristics of the project is the separation between the logical storage structure and the physical filesystem.

Users see meaningful names such as:

```text

Documents
    │
    ├── Projects
    │      ├── project.pdf
    │      └── report.docx
    │
    └── Personal
           └── photo.jpg

```

The physical filesystem does not necessarily use those names.

Instead, storage identifiers such as UUIDs are used:

```text

/storage/
    ├── <uuid>/
    │     ├── <uuid>/
    │     └── <uuid>/
    └── ...

```

The database maintains the relationship between the logical object and its physical storage location.

For example:

```text

Logical name:
project.pdf

Database:
storageName = "8f2c...-uuid"

Physical file:
.../8f2c...-uuid

```

This allows the application to control the logical directory structure without depending directly on physical filenames.

---

# Authentication

Authentication is already implemented.

The authentication system includes:

* User authentication
* Email verification
* Phone/SMS notifications

Planned notification use cases include:

```text

Storage limit warning        Storage limit reached
        │                             │
        ▼                             ▼
SMS / phone notification     SMS / Phone Notification

```

---

# Folder Management

Folder management is currently the most developed part of the application.

## Current status

```text

Folders

✅ View all folders
✅ Create folder
✅ Move to trash
✅ Delete individual folder
✅ Download folder
⏳ Delete multiple
⏸️ Multiple downloads → Beta / v2
✅ Favorite
✅ Edit folder
✅ Folder data

```

The folder system uses hierarchical relationships stored in PostgreSQL.

Recursive queries are used when traversing folder hierarchies and resolving parent/child relationships.

---

# File Management

File management is the next major development phase.

```text

Files

⏳ File module
⏳ Uploads
⏳ Downloads
⏳ File operations
⏳ Multiple file operations

```

The exact implementation will follow the same logical-storage/physical-storage architecture used by folders.

---

# Downloads

The backend supports different download scenarios:

```text

Downloads
    │
    ├── Single file
    ├── Multiple files
    │         └── ZIP
    └── Folder
          └── ZIP

```

Folder downloads preserve the logical folder/file names when generating the archive rather than exposing the UUID-based physical storage structure.

Multiple downloads are intentionally postponed for a later beta/v2 stage.

---

# Backup Automation

Backups are handled independently from the Management CLI.

The backup system is intended to use Python/Bash and execute automatically through `cron`.

```text

                            cron
                            │ 03:00
                            │  AM
                            ▼
                        Backup Automation
        ┌─────────────────────┼─────────────────────┐
Create backups        Verify backups     Apply Retention Policy

```

The intended schedule is:

```text
Every day at 03:00 AM
```

The CLI **does not create backups**.

It only provides information about existing backups.

---

# Management CLI

The project includes a dedicated **Bash-based Management CLI** for server administration.

The CLI is accessed remotely through SSH.

```text

┌──────────────────────┐
│         MAC          │
└──────────────────────┘
            │ Bash
            │ CLI
            ▼
┌──────────────────────┐
│   Home Server CLI    │
├──────────────────────┤
│ 1. System Status     │
│ 2. Storage           │
│ 3. Logs              │
│ 4. Backups           │
│ 5. Services          │
│ 6. SSH               │
│ 7. Maintenance       │
└──────────┬───────────┘
           │
          SSH
           │
           ▼
┌────────────────────────────┐
│       Debian Server        │
├────────────────────────────┤
│  NestJS API                │
│  PostgreSQL                │
│  Storage                   │
│  Backup files              │
│  Linux                     │
└────────────────────────────┘

```

The CLI is a separate administrative component and is not part of the web application's frontend.

---

## 1. System Status

Provides information about the server's current state.

```text

System Status
      │
      ├── CPU
      ├── RAM
      ├── Storage
      ├── Uptime
      └── Network

```

---

## 2. Storage

Provides information about server storage.

```text

Storage
   │
   ├── Disk usage
   ├── Directories
   └── Available space

```

---

## 3. Logs

Provides access to relevant logs.

```text

Logs
 │
 ├── System logs
 └── Service logs

```

---

## 4. Backups

The CLI only queries backups that already exist.

```text

Backups
   │
   ├── List backups
   └── Total backups

```

Backup creation is handled by the independent automation script.

---

## 5. Services

Allows the administrator to inspect and manage important services.

```text

 Services
    │
    ├── Status
    └── Restart

```

The main services currently considered are:

```text

NestJS API
PostgreSQL

```

---

## 6. SSH

Provides an interactive SSH shell.

```text

SSH
 └── Interactive shell

```

This allows the administrator to access the Debian server directly without leaving the CLI workflow.

---

## 7. Maintenance

Contains administrative operations for maintaining the server.

```text
Maintenance
    │
    ├── Update application
    └── Cleanup
```

Additional maintenance operations may be added later.

---

# Responsibilities

Each component has a specific responsibility.

| Component                  | Responsibility                   |
| -------------------------- | -------------------------------- |
| **Next.js**                | User interface                   |
| **NestJS**                 | Application/API logic            |
| **PostgreSQL**             | Application data and metadata    |
| **Prisma**                 | Database ORM                     |
| **Dedicated HDD**          | Physical file storage            |
| **Bash CLI**               | Server administration            |
| **Python      automation** | Backup creation and verification |
| **cron**                   | Backup scheduling                |
| **Debian**                 | Server operating system          |

The system intentionally separates:

```text
        Application
            │
            └── User-facing functionality
        
        Management CLI
            │
            └── Administrator-facing functionality
        
        Backup Automation
            │
            └── Automated system tasks
```

---

# Server Environment

The server runs **Debian Linux**.

The main server-side components are:

```text

          Debian
            │
            ├── Node.js
            ├── NestJS
            ├── PostgreSQL
            ├── Physical storage
            ├── Bash CLI
            ├── Python
            └── cron

```

---

# Deployment

Deployment is planned but has not been completed yet.

The intended deployment stages are:

```text

        Deployment
            │
            ├── Local network
            │
            └── Public access

```

The project is currently under active development and is **not yet considered deployed**.

---

# Current Development Status

## Completed

### Authentication
### Folders

Remaining:

### Delete multiple

---

## Pending

### Files

The complete file-management system still needs to be implemented.

### UI

The main frontend UI remains to be implemented.

### Responsive Design

Responsive behavior will be implemented as part of the UI phase.

### Backup Automation

The Python/Bash backup automation and cron scheduling remain to be completed.

### Deployment

Deployment to the local network and eventually public access remains pending.

---

# Roadmap

```text
                Authentication
                      │
                      ▼
                   Folders
                      │
                      ├── Delete multiple
                      │
                      ▼
                    Files
                      │
                      ▼
                      UI
                      │
                      ▼
             Responsive Design
                      │
                      ▼
             Backup Automation
                      │
                      ▼
             Management CLI
                      │
                      ▼
             Testing / Hardening
                      │
                      ▼
                 Deployment
                      │
                      ├── Local Network
                      │
                      └── Public Access
```

Multiple downloads are intentionally postponed until a later beta/v2 stage.

---

# Project Goals

The main goals of the Home Server are:

* Build a private cloud storage platform.
* Provide a complete file and folder management system.
* Separate logical storage from physical storage.
* Use UUID-based physical storage identifiers.
* Provide reliable file streaming.
* Implement automated backups.
* Provide backup verification and retention.
* Create a dedicated server administration CLI.
* Keep administrative functionality separate from user-facing functionality.
* Support local network deployment.
* Eventually provide secure public access.

---

# Core Architecture Principle

The most important design principle of the project is the separation of concerns between:

```text
                              HOME SERVER
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
                Application     Management     Automation
                    │              │              │
                 Next.js        Bash CLI       Python/Bash
                    │              │              │
                 NestJS           SSH           cron
                    │
              ┌─────┴─────┐
              ▼           ▼
          PostgreSQL     HDD
              │           │
           Logical      Physical
           storage      storage
```

The **web application** manages user data.

The **Management CLI** manages the server.

The **Backup Automation** manages scheduled backups.

Each component has a clearly defined responsibility while operating together as a single self-hosted platform.

---

# Project Status

**Active Development**

Current priority:

```text

1. Finish Folders
2. Implement Files
3. Build UI
4. Responsive Design
5. Complete CLI
6. Implement Backup Automation
7. Testing / Hardening
8. Deployment

```

The project is currently being developed on a Debian-based home server environment.
