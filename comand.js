
function copiarTexto() {
    const texto = document.getElementById("texto").value;
    texto.select();
    navigator.clipboard.writeText(texto);
    alert("Texto copiado para a área de transferência!");
}
        