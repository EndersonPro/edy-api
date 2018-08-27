
function formatBytes(a, b) { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }


function SaveAsFile(t,f,m) {
    try {
        var b = new Blob([t],{type:m});
        saveAs(b, f);
    } catch (e) {
        window.open("data:"+m+"," + encodeURIComponent(t), '_blank','');
    }
}



let titulo = ''
let urld = ''
let extenciond = ''
let named = ''

$('#btn-search').on('click', function (event) {
    event.preventDefault();
    let url = $('#url-youtube').val()

    let patron = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i
    if (
        patron.test(url)
    ) {


        /* v=[A-Za-z0-\u00C0-\u017F]* */
    }
    $.get(`http://127.0.0.1:5000/api/${url}`, function (datos) {
        $("#result").fadeIn()
        $("#img-result").attr('src', `${datos.data.imagen}`)
        $("#titulo").html(`Titulo: ${datos.data.titulo}`)
        $("#duracion").html(`Duracion: ${datos.data.duracion}`)

        titulo = datos.data.titulo

        $AudioStream = ''
        $.each(datos.data.audiostream, function (key, value) {
            var tamano = formatBytes(value.tamano, 2)
            $AudioStream += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    MP3 - Calidad ${value.bitrate}
                    <span class="badge badge-success">${tamano}</span>
                    <button type="button" url-d="${value.url}" class="btn btn-danger">Descargar</button>
                </li>
            `
        })

        $('#audio-streams').html($AudioStream)
        $VideoStream = ''
        $.each(datos.data.videostream, function (key, value) {
            var tamano = formatBytes(value.tamano, 2)
            $VideoStream += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Video - Calidad ${value.resolucion}
                    <span class="badge badge-success">${tamano}</span>
                    <span class="badge badge-info">${value.extencion}</span>
                    <button type="button" url-d="${value.url}" class="btn btn-danger">Descargar</button>
                    <a title="formato de vídeo: ${value.resolucion}"  download="Video.mp4" data-quality="${value.resolucion}" data-type="${value.extencion}" href="${value.url}" data-ga-event="send;event;result;click;101">Descargar</a>
                </li>
            `
        })
        $('#video-streams').html($VideoStream)
    })


})

$("#video-streams").on("click", "li .btn", function (evento) {
    evento.preventDefault()
    let parameter3 = "video/"
    urld = $(this).attr('url-d')
    console.log(urld)
    extenciond = $(this).siblings().eq(1).html()
    named = titulo + '.' + extenciond
    parameter3 += extenciond
    console.log(parameter3)
    SaveAsFile(urld,named,parameter3);
    
})

$("#audio-streams").on("click", "li .btn", function (evento) {
    evento.preventDefault()
    
    urld = $(this).attr('url-d')
    console.log(urld)
    named = titulo + '.mp3'
    SaveAsFile(urld,named,"audio/mp3");
})