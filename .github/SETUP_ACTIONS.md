# Настройка GitHub Actions для авто-синхронизации

## 1. Создайте Personal Access Token

1. Перейдите в **GitHub Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Нажмите **Generate new token**
3. Укажите:
   - **Token name**: `gsd-qwen-sync`
   - **Expiration**: 1 год (или бессрочный)
   - **Repository access**: Only select repositories → выберите ваш форк `gsd-qwen`
4. Разрешения:
   - `Contents`: Read and write
   - `Pull requests`: Read and write
   - `Workflows`: Read and write
5. Скопируйте токен

## 2. Добавьте секрет в репозиторий

1. Перейдите в ваш форк `gsd-qwen`
2. **Settings → Secrets and variables → Actions**
3. **New repository secret**
4. Укажите:
   - **Name**: `PAT_TOKEN`
   - **Value**: вставьте скопированный токен
5. Нажмите **Add secret**

## 3. Включите GitHub Actions

1. **Settings → Actions → General**
2. Убедитесь, что **Allow all actions and reusable workflows** включено
3. Сохраните

## 4. Проверьте workflow

1. Перейдите во вкладку **Actions**
2. Найдите workflow **Sync and Transform GSD**
3. Нажмите **Run workflow** для ручного запуска
4. Выберите ветку (обычно `main`)
5. Нажмите **Run workflow**

## 5. Мониторинг

- Все запуски видны во вкладке **Actions**
- При успехе: создаётся PR с трансформациями → авто-мердж
- При ошибке: создаётся Issue с деталями

## Расписание

Workflow запускается:
- **Автоматически**: каждые 6 часов (`0 */6 * * *`)
- **Вручную**: через вкладку Actions → Run workflow

---

## Troubleshooting

### Workflow не запускается

Проверьте:
1. Actions включены в настройках репозитория
2. Секрет `PAT_TOKEN` добавлен корректно
3. PAT токен имеет нужные разрешения

### PR не создаётся

Проверьте логи workflow:
1. **Actions → Sync and Transform GSD → последний запуск**
2. Найдите шаг **Commit and push**
3. Если изменений нет — upstream не обновился

### Auto-merge не работает

Проверьте:
1. **Settings → Pull requests → Allow auto-merge** включено
2. Статус чеки прошли успешно
3. PAT токен имеет право на merge
