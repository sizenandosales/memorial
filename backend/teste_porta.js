fetch('https://bbeructbqaafuwecvoxd.supabase.co')
  .then((res) => console.log('Sucesso! Status:', res.status))
  .catch((err) => console.error('Erro de Fetch:', err.message));
