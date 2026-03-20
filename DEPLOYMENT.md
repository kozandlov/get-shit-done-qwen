# Инструкция по развёртыванию gsd-qwen

## Быстрый старт

### 1. Форкните репозиторий

1. Перейдите на https://github.com/YOUR_USERNAME/gsd-qwen
2. Нажмите **Fork**
3. Создайте форк в вашем аккаунте

### 2. Настройте GitHub Actions

Следуйте инструкции в `.github/SETUP_ACTIONS.md`:

1. Создайте Personal Access Token с правами:
   - `Contents`: Read and write
   - `Pull requests`: Read and write
   - `Workflows`: Read and write

2. Добавьте секрет в репозиторий:
   - **Settings → Secrets and variables → Actions**
   - Name: `PAT_TOKEN`
   - Value: ваш токен

3. Включите GitHub Actions:
   - **Settings → Actions → General**
   - Разрешите все actions

### 3. Проверьте workflow

1. Перейдите во вкладку **Actions**
2. Выберите **Sync and Transform GSD**
3. Нажмите **Run workflow**
4. Дождитесь завершения

### 4. Обновите README.md

Замените `YOUR_USERNAME` на ваш GitHub username в файлах:

- `README.md` (3 места)
- `package.json` (3 места)

---

## Первый запуск

После настройки workflow автоматически:

1. Проверит upstream репозиторий `gsd-build/get-shit-done`
2. Скачает последнюю версию
3. Запустит скрипт трансформации:
   - `commands/gsd/*.md` → `skills/gsd-*/SKILL.md`
   - `~/.claude/` → `~/.qwen/`
   - `/gsd:` → `$gsd-`
4. Создаст PR с изменениями
5. Автоматически замержит PR после прохождения тестов

---

## Установка локально (для тестирования)

```bash
# Клонируйте ваш форк
git clone https://github.com/YOUR_USERNAME/gsd-qwen.git
cd gsd-qwen

# Проверьте скрипт трансформации
node scripts/transform-to-qwen.js --help

# Запустите валидацию
npm run validate
```

---

## Структура файлов

```
gsd-qwen/
├── .github/
│   ├── workflows/
│   │   ├── sync-and-transform.yml    # Авто-синхронизация
│   │   └── validate.yml              # Валидация
│   └── SETUP_ACTIONS.md              # Инструкция по настройке
├── scripts/
│   └── transform-to-qwen.js          # Скрипт трансформации
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

После первого запуска workflow будут созданы:

```
gsd-qwen/
├── skills/                         # Скиллы для Qwen
├── get-shit-done/                  # Ядро системы
│   ├── workflows/
│   ├── templates/
│   └── references/
└── bin/                            # CLI утилиты
```

---

## Мониторинг

### Вкладка Actions

- **Sync and Transform GSD** — основной workflow
- **Validate Transformation** — тесты для PR

### Уведомления

- При успехе: PR создаётся и автоматически мерджится
- При ошибке: создаётся Issue с деталями

---

## Troubleshooting

### Workflow не запускается

1. Проверьте, что Actions включены (**Settings → Actions**)
2. Проверьте секрет `PAT_TOKEN`
3. Проверьте права PAT токена

### PR не создаётся

1. Проверьте логи workflow во вкладке Actions
2. Убедитесь, что upstream обновился
3. Проверьте, что скрипт трансформации отработал без ошибок

### Auto-merge не работает

1. **Settings → Pull requests → Allow auto-merge** должно быть включено
2. Проверьте, что все статус чеки прошли
3. Убедитесь, что PAT токен имеет право на merge

---

## Обновление документации

После первого успешного запуска workflow обновите README.md:

1. Замените ссылки на ваш репозиторий
2. Обновите таблицу соответствия команд
3. Добавьте скриншоты успешных запусков (опционально)

---

## Поддержка

При возникновении проблем:

1. Проверьте Issues — возможно, проблема уже известна
2. Создайте новый Issue с логами workflow
3. Проверьте `.github/SETUP_ACTIONS.md`
