function dateFormatter(fecha) {
    var isAC = false;
    if(fecha.startsWith('-')){
        isAC = true;
        fecha = fecha.substring(1);
    }

    const [año, mes, dia] = fecha.split('T')[0].split('-').map(n => Number.parseInt(n).toFixed());

    const fechaFormateada = `${dia}/${mes}/${año} ${isAC ? 'a.C.' : ''}`;
    
    return fechaFormateada;
}
  
// Ejemplo de uso
const fecha = '-0201-01-01T00:00:00Z';
const fechaFormateada = dateFormatter(fecha);
console.log(fechaFormateada); // Output: "01/01/0201 AC"
  