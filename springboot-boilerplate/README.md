# Spring Boot Boilerplate

Boilerplate Spring Boot 3.4.4 avec authentification JWT, gestion de profil, CRUD générique et PostgreSQL.

## Stack

- Java 21
- Spring Boot 3.4.4
- Spring Security + JWT (jjwt 0.12.6)
- Spring Data JPA
- PostgreSQL
- Lombok
- Validation

## Prérequis

- JDK 21
- PostgreSQL 15+
- Maven (ou utiliser le wrapper `mvnw`)

## Configuration

Copier `src/main/resources/application.yml` et ajuster les paramètres de la base de données :

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/boilerplate
    username: postgres
    password: postgres

app:
  jwt:
    secret: <votre-secret-base64>
    expiration-ms: 86400000
```

Un profil `dev` est disponible (`application-dev.yml`) qui active les logs SQL et le `ddl-auto: create-drop`.

## Lancement

```bash
# Créer la base de données
createdb boilerplate

# Lancer l'application
./mvnw spring-boot:run

# Avec le profil dev
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

## Structure

```
src/main/java/com/boilerplate/
├── auth/
│   ├── AuthController.java        # POST /api/auth/register, /login
│   ├── AuthService.java           # Logique d'inscription/connexion
│   ├── JwtTokenProvider.java      # Génération et validation JWT
│   └── JwtAuthenticationFilter.java # Filtre Spring Security
├── config/
│   ├── SecurityConfig.java        # Configuration Spring Security
│   ├── CorsConfig.java            # Configuration CORS
│   └── DataInitializer.java       # Seed admin au démarrage
├── crud/
│   ├── common/
│   │   ├── BaseEntity.java        # Entité abstraite (UUID, timestamps)
│   │   ├── BaseService.java       # Service CRUD générique
│   │   └── BaseController.java    # Controller REST CRUD générique
│   ├── Todo.java                  # Exemple d'entité
│   ├── TodoRepository.java
│   ├── TodoService.java
│   └── TodoController.java
├── dto/
│   ├── ApiResponse.java           # Réponse standardisée (data + pagination)
│   ├── AuthResponse.java
│   ├── LoginRequest.java
│   ├── ProfileUpdateRequest.java
│   └── RegisterRequest.java
├── exception/
│   ├── GlobalExceptionHandler.java # Handler global (@RestControllerAdvice)
│   ├── BadRequestException.java
│   └── ResourceNotFoundException.java
├── user/
│   ├── User.java                  # Entité User (implements UserDetails)
│   ├── UserRepository.java
│   ├── Role.java                  # Enum : USER, ADMIN
│   └── ProfileController.java     # GET/PUT/DELETE /api/profile
└── BoilerplateApplication.java
```

## API

### Authentication

| Méthode | Endpoint | Body | Description |
|---------|----------|------|-------------|
| POST | `/api/auth/register` | `{ email, password, firstname, lastname }` | Créer un compte |
| POST | `/api/auth/login` | `{ email, password }` | Se connecter |

Réponse : `{ token, email, firstname, lastname, role }`

### Profil (JWT requis)

| Méthode | Endpoint | Body | Description |
|---------|----------|------|-------------|
| GET | `/api/profile` | - | Voir son profil |
| PUT | `/api/profile` | `{ firstname, lastname, avatarUrl }` | Modifier son profil |
| DELETE | `/api/profile` | - | Supprimer son compte |

### CRUD Todos (JWT requis)

| Méthode | Endpoint | Body | Description |
|---------|----------|------|-------------|
| GET | `/api/todos` | - | Liste paginée |
| GET | `/api/todos/{id}` | - | Détail |
| POST | `/api/todos` | `{ title, description, completed }` | Créer |
| PUT | `/api/todos/{id}` | `{ title, description, completed }` | Modifier |
| DELETE | `/api/todos/{id}` | - | Supprimer |

## Format des réponses

Succès :
```json
{
  "success": true,
  "message": "optional message",
  "data": { ... },
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

Erreur :
```json
{
  "success": false,
  "message": "Description de l'erreur"
}
```

## Compte admin par défaut

- Email : `admin@boilerplate.com`
- Mot de passe : `admin123`
- Rôle : `ADMIN`

## Créer une nouvelle entité CRUD

Étendre les classes génériques :

```java
// 1. Entité
@Entity
public class Product extends BaseEntity { ... }

// 2. Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {}

// 3. Service
@Service
public class ProductService extends BaseService<Product, ProductRepository> {
    public ProductService(ProductRepository repo) { super(repo); }
    @Override protected void updateFields(Product existing, Product updated) { ... }
}

// 4. Controller
@RestController @RequestMapping("/api/products")
public class ProductController extends BaseController<Product, ProductService> {
    public ProductController(ProductService service) { super(service, "Product"); }
}
```

Les 5 endpoints CRUD sont automatiquement disponibles.
