# GET SHIT DONE for Qwen Code CLI

**Система мета-промптинга, контекстного инжиниринга и спеко-ориентированной разработки для Qwen Code CLI.**

Решает проблему "context rot" — деградации качества, которая происходит при заполнении контекстного окна AI.

---

## Установка для Qwen Code CLI

### Глобально (все проекты)

```bash
git clone https://github.com/YOUR_USERNAME/gsd-qwen.git ~/.qwen/get-shit-done
ln -s ~/.qwen/get-shit-done/skills/* ~/.qwen/skills/
```

### Локально (только текущий проект)

```bash
git clone https://github.com/YOUR_USERNAME/gsd-qwen.git .qwen/get-shit-done
```

### Автоматическая синхронизация

Этот репозиторий автоматически синхронизируется с [оригинальным gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) каждые 6 часов через GitHub Actions. При новом релизе upstream:

1. Workflow обнаруживает новый релиз
2. Файлы автоматически трансформируются из формата Claude Code в Qwen Code CLI
3. Создаётся и автоматически мерджится PR с изменениями

---

## Начало работы

После установки используйте команды:

```bash
$gsd-new-project       # Инициализация нового проекта
$gsd-plan-phase 1      # Планирование фазы 1
$gsd-execute-phase 1   # Выполнение фазы 1
$gsd-verify-work 1     # Верификация работы
$gsd-help              # Справка по всем командам
```

---

## Соответствие команд

| Claude Code (оригинал) | Qwen Code CLI (адаптация) |
|------------------------|---------------------------|
| `/gsd:new-project` | `$gsd-new-project` |
| `/gsd:plan-phase` | `$gsd-plan-phase` |
| `/gsd:execute-phase` | `$gsd-execute-phase` |
| `/gsd:verify-work` | `$gsd-verify-work` |
| `/gsd:help` | `$gsd-help` |
| `/gsd:progress` | `$gsd-progress` |
| `/gsd:discuss-phase` | `$gsd-discuss-phase` |
| `/gsd:map-codebase` | `$gsd-map-codebase` |
| `/gsd:pause-work` | `$gsd-pause-work` |
| `/gsd:resume-work` | `$gsd-resume-work` |

---

## Как это работает

### 1. Инициализация проекта

```bash
$gsd-new-project
```

Система задаёт вопросы, исследует домен, извлекает требования и создаёт roadmap.

**Создаёт:**
- `.planning/PROJECT.md` — видение проекта
- `.planning/REQUIREMENTS.md` — требования v1/v2
- `.planning/ROADMAP.md` — дорожная карта фаз
- `.planning/STATE.md` — память проекта
- `.planning/config.json` — настройки workflow

### 2. Планирование фазы

```bash
$gsd-plan-phase 1
```

Исследует, создаёт атомарные планы задач и верифицирует их.

**Создаёт:** `.planning/phases/01-name/01-NN-PLAN.md`

### 3. Выполнение фазы

```bash
$gsd-execute-phase 1
```

Запускает планы волнами (параллельно где возможно), каждый с fresh контекстом.

**Создаёт:** `.planning/phases/01-name/01-NN-SUMMARY.md`

### 4. Верификация работы

```bash
$gsd-verify-work 1
```

Вы подтверждаете, что функция действительно работает как ожидается.

---

## Почему это работает

### Контекстный инжиниринг

GSD управляет контекстом за вас через файлы:

| Файл | Назначение |
|------|------------|
| `PROJECT.md` | Видение проекта |
| `REQUIREMENTS.md` | Скоупированные требования v1/v2 |
| `ROADMAP.md` | Куда движетесь |
| `STATE.md` | Память между сессиями |
| `PLAN.md` | Атомарная задача с XML-структурой |

### Атомарные планы

Каждый план содержит 2-3 задачи максимум — это предотвращает context rot и обеспечивает качественное выполнение.

### Git Commit'ы

Каждая задача получает свой коммит:

```bash
abc123f docs(01-02): complete user registration plan
def456g feat(01-02): add email confirmation flow
```

---

## Структура репозитория

```
gsd-qwen/
├── .github/workflows/
│   ├── sync-and-transform.yml    # Авто-синхронизация с upstream
│   └── validate.yml              # Валидация трансформации
├── scripts/
│   └── transform-to-qwen.js      # Скрипт трансформации
├── skills/                       # Скиллы для Qwen Code CLI
│   ├── gsd-new-project/
│   │   └── SKILL.md
│   ├── gsd-plan-phase/
│   │   └── SKILL.md
│   └── ...
├── get-shit-done/
│   ├── workflows/                # Workflow файлы
│   ├── templates/                # Шаблоны документов
│   └── references/               # Справочные материалы
├── bin/                          # CLI утилиты
├── package.json
└── README.md
```

---

## Автоматическая синхронизация

### Как работает

1. **Обнаружение релиза** — workflow проверяет upstream каждые 6 часов
2. **Трансформация** — скрипт `transform-to-qwen.js` конвертирует файлы:
   - `commands/gsd/*.md` → `skills/gsd-*/SKILL.md`
   - `~/.claude/` → `~/.qwen/`
   - `/gsd:` → `$gsd-`
   - Инструменты: `AskUserQuestion` → `ask_user_question`
3. **Валидация** — тесты проверяют корректность трансформации
4. **Auto-merge** — PR автоматически мерджится после прохождения тестов

### Настройка секретов

Для работы авто-синхронизации добавьте в репозиторий секрет:

1. **GitHub Settings → Secrets and variables → Actions**
2. **New repository secret**
   - Name: `PAT_TOKEN`
   - Value: [Personal Access Token](https://github.com/settings/tokens) с правами:
     - `Contents`: Read and write
     - `Pull requests`: Read and write
     - `Workflows`: Read and write

### Ручной запуск

```bash
# Вкладка Actions → Sync and Transform GSD → Run workflow
# Можно указать конкретную версию upstream
```

---

## Команды

### Core Workflow

| Команда | Описание |
|---------|----------|
| `$gsd-new-project` | Инициализация: вопросы → research → требования → roadmap |
| `$gsd-discuss-phase [N]` | Захват решений по реализации |
| `$gsd-plan-phase [N]` | Research + план + верификация |
| `$gsd-execute-phase [N]` | Выполнение планов волнами |
| `$gsd-verify-work [N]` | User acceptance testing |

### Утилиты

| Команда | Описание |
|---------|----------|
| `$gsd-progress` | Где я? Что дальше? |
| `$gsd-help` | Все команды |
| `$gsd-pause-work` | Создание handoff при остановке |
| `$gsd-resume-work` | Восстановление из последней сессии |
| `$gsd-map-codebase` | Маппинг существующей кодовой базы |

---

## Отличия от оригинала

| Аспект | Claude Code (оригинал) | Qwen Code CLI (адаптация) |
|--------|------------------------|---------------------------|
| Формат команд | `/gsd:command` | `$gsd-command` |
| Структура | `commands/gsd/*.md` | `skills/gsd-*/SKILL.md` |
| Пути | `~/.claude/` | `~/.qwen/` |
| Инструменты | `AskUserQuestion` | `ask_user_question` |
| Subagents | `Task` | `task` |

---

## Лицензия

MIT License — см. [оригинальную лицензию](https://github.com/gsd-build/get-shit-done/blob/main/LICENSE).

---

**Qwen Code CLI мощный. GSD делает его надёжным.**
