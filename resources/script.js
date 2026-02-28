document.addEventListener('DOMContentLoaded', function() {

    const operand1Input = document.getElementById('operand1');
    const operand2Input = document.getElementById('operand2');
    const operatorSelect = document.getElementById('operator');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultField = document.getElementById('result-field');
    
    let history = [];

     // Функция для замены запятой на точку
    function normalizeNumber(value) {
        return value.replace(',', '.');
    }

    function isValidNumber(value) {
        if (value === '' || value === null || value === undefined) {
            return false;
        }
        const normalizedValue = normalizeNumber(value);
        return !isNaN(parseFloat(normalizedValue)) && isFinite(normalizedValue);
    }
    
    // Функция для удаления класса ошибки у полей
    function removeErrors() {
        operand1Input.classList.remove('error-input');
        operand2Input.classList.remove('error-input');
        
        // Удаляем существующие сообщения об ошибках
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(error => error.remove());
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        resultField.parentNode.insertBefore(errorDiv, resultField.nextSibling);
    }
    
    function calculate() {
        removeErrors();
        
        const val1 = operand1Input.value.trim();
        const val2 = operand2Input.value.trim();
        const operator = operatorSelect.value;
        
        let hasError = false;

        if (!isValidNumber(val1)) {
            operand1Input.classList.add('error-input');
            hasError = true;
        }
  
        if (!isValidNumber(val2)) {
            operand2Input.classList.add('error-input');
            hasError = true;
        }
        
        if (hasError) {
            showError('Пожалуйста, введите корректные числа (используйте цифры, точку или запятую)');
            return;
        }
        
        const num1 = parseFloat(normalizeNumber(val1));
        const num2 = parseFloat(normalizeNumber(val2));
 
        if (operator === '/' && num2 === 0) {
            operand2Input.classList.add('error-input');
            showError('Деление на ноль невозможно');
            return;
        }

        let result;
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                result = num1 / num2;
                break;
            default:
                result = 'Ошибка';
        }
        
        // Форматируем результат (ограничиваем до 10 знаков после запятой)
        if (typeof result === 'number') {
            result = parseFloat(result.toFixed(10));
        }
        
        const exampleString = `${val1} ${operator} ${val2} = ${result}`;
        
        history.push(exampleString);
        
        // Оставляем только последние 2 примера
        if (history.length > 2) {
            history.shift();
        }
        
        displayResults();
    }
    
    function displayResults() {
        resultField.innerHTML = '';
        
        if (history.length === 0) {
            return;
        }
        
        // Отображаем предыдущий результат (если есть)
        if (history.length === 2) {
            const prevDiv = document.createElement('div');
            prevDiv.className = 'previous-result';
            prevDiv.textContent = history[0];
            resultField.appendChild(prevDiv);
        }
        
        // Отображаем текущий результат
        const currentDiv = document.createElement('div');
        currentDiv.className = 'current-result';
        currentDiv.textContent = history[history.length - 1];
        resultField.appendChild(currentDiv);
    }
    
    // Функция для валидации ввода в реальном времени
    function validateInput(input) {
        input.addEventListener('input', function() {
            // Разрешаем цифры, точку, запятую и знак минус в начале
            const value = this.value;
            const lastChar = value[value.length - 1];
            
            if (value.length > 0) {
                // Проверяем, что последний символ допустим
                if (!/^[\d\.,\-]$/.test(lastChar)) {
                    this.value = value.slice(0, -1);
                }
                
                // Проверяем, что минус может быть только в начале
                if (lastChar === '-' && value.indexOf('-') !== value.lastIndexOf('-')) {
                    this.value = value.slice(0, -1);
                }
            }
        });
        
        // Убираем ошибку при начале ввода
        input.addEventListener('focus', function() {
            this.classList.remove('error-input');
            const existingErrors = document.querySelectorAll('.error-message');
            existingErrors.forEach(error => error.remove());
        });
    }

    validateInput(operand1Input);
    validateInput(operand2Input);
    
    // Обработчик для кнопки подсчета
    calculateBtn.addEventListener('click', calculate);
    
    // Обработчик для клавиши Enter
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculate();
        }
    });
});