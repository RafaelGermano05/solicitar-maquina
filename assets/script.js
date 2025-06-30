const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzV7TvMYidEljG_XbmQk3zC2YizpoMITN2DbPX-e9E7PGeDcb973zrM4RGIOgGu0-IP/exec';

// Elementos do formulário
const form = document.getElementById('requestForm');
const successMessage = document.getElementById('successMessage');
const newRequestBtn = document.getElementById('newRequestBtn');

const requiredFields = [
    { id: 'supervisor', errorId: 'supervisor-error' },
    { id: 'email', errorId: 'email-error' },
    { id: 'cidade', errorId: 'cidade-error' },
    { id: 'quantidade', errorId: 'quantidade-error' }
];

function validateForm() {
    let isValid = true;
    
    // Validação dos campos obrigatórios
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        const errorElement = document.getElementById(field.errorId);
        
        if (!input.value.trim()) {
            showError(input, errorElement, 'Este campo é obrigatório');
            isValid = false;
        } else {
            clearError(input, errorElement);
        }
    });
    
    // Validação específica para email
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    if (emailInput.value && !validateEmail(emailInput.value)) {
        showError(emailInput, emailError, 'Por favor, insira um email válido');
        isValid = false;
    }
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, errorElement, message) {
    input.style.borderColor = 'var(--error)';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(input, errorElement) {
    input.style.borderColor = 'var(--border)';
    errorElement.style.display = 'none';
}

function resetForm() {
    form.reset();
    requiredFields.forEach(field => {
        document.getElementById(field.id).style.borderColor = 'var(--border)';
        document.getElementById(field.errorId).style.display = 'none';
    });
    
    document.getElementById('quantidade').value = 1;
}

// async function submitRequest(data) {
//   try {
//     // Primeiro faz uma requisição OPTIONS para verificar CORS
//     try {
//       await fetch(WEB_APP_URL, {
//         method: 'OPTIONS'
//       });
//     } catch (optionsError) {
//       console.log("OPTIONS request completed");
//     }
    
//     // Agora faz a requisição POST real
//     const response = await fetch(WEB_APP_URL, {
//       method: 'POST',
//       mode: 'no-cors', 
//       body: JSON.stringify(data),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || 'Erro ao enviar solicitação');
//     }
    
//     return await response.json();
//   } catch (error) {
//     console.error('Erro detalhado:', {
//       message: error.message,
//       stack: error.stack
//     });
//     throw error;
//   }
// }

async function submitRequest(data) {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors', 
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Mesmo com CORS, podemos verificar se a requisição chegou ao destino
    // Se chegou até aqui sem erro, consideramos sucesso
    return { status: "success" };
    
  } catch (error) {
    console.error('Erro detalhado:', error);
    throw error;
  }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        supervisor: document.getElementById('supervisor').value.trim(),
        email: document.getElementById('email').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        quantidade: document.getElementById('quantidade').value,
        observacoes: document.getElementById('observacoes').value.trim(),
        data: new Date().toISOString()
    };
    
    // Mostrar loading no botão
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
        const result = await submitRequest(formData);
        
        if (result.status === "success") {
            document.getElementById('success-details').textContent = `
                Solicitação registrada para ${formData.cidade}.
                Quantidade: ${formData.quantidade} máquina(s).
            `;
            
            // Esconder formulário e mostrar mensagem de sucesso
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            resetForm();
        }
    } catch (error) {
        alert('Ocorreu um erro ao enviar a solicitação. Por favor, tente novamente.');
    } finally {
        // Restaurar botão independente do resultado
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// form.addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//         return;
//     }
    
//     const formData = {
//         supervisor: document.getElementById('supervisor').value.trim(),
//         email: document.getElementById('email').value.trim(),
//         cidade: document.getElementById('cidade').value.trim(),
//         quantidade: document.getElementById('quantidade').value,
//         observacoes: document.getElementById('observacoes').value.trim(),
//         data: new Date().toISOString()
//     };
    
//     // Mostrar loading no botão
//     const submitBtn = form.querySelector('button[type="submit"]');
//     const originalBtnText = submitBtn.innerHTML;
//     submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
//     submitBtn.disabled = true;
    
//     try {
//         await submitRequest(formData);
        
//         document.getElementById('success-details').textContent = `
//             Solicitação registrada para ${formData.cidade}.
//             Quantidade: ${formData.quantidade} máquina(s).
//         `;
        
//         // Esconder formulário e mostrar mensagem de sucesso
//         form.style.display = 'none';
//         successMessage.style.display = 'block';
        
//         resetForm();
//     } /*catch (error) {
//         alert('Ocorreu um erro ao enviar a solicitação. Por favor, tente novamente.');
//     } */finally {
//         // Restaurar botão independente do resultado
//         submitBtn.innerHTML = originalBtnText;
//         submitBtn.disabled = false;
//     }
// });

newRequestBtn.addEventListener('click', () => {
    successMessage.style.display = 'none';
    form.style.display = 'block';
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Configura valores iniciais se necessário
});