/**/

function CanvasPieChart( containerElemId, data, options )
{

    if ( !options ) var options = {};

    var t = this;
    t.data = data || [];
    t.doc = options.doc || document;
    t.canvasWrapper = t.doc.getElementById( containerElemId );
    t.canvas = null;
    t.width = options.width || 400;
    t.height = options.height || 400;


    function createCanvas()
    {
        var canvas = t.doc.createElement('canvas');

        canvas.id = containerElemId + '-canvas';
        canvas.width = t.width;
        canvas.height = t.height;

        t.canvasWrapper.appendChild(canvas);
        t.canvas = canvas;
    }


    function getTotal()
    {
        var total = 0, i;

        for ( i = 0; i < t.data.length; i++ )
        {
            total += (typeof t.data[i].value == 'number') ? t.data[i].value : 0;
        }

        return total;
    }


    function createPie() {
        var ctx,
                lastend = 0,
                total = getTotal(),
                width,
                height,
                centerX,
                centerY,
                label,
                value,
                color;

        ctx = t.canvas.getContext("2d");
        width = t.canvas.width;
        height = t.canvas.height;
        centerX = width / 2;
        centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        /*
        var shadowOffset = 3;
        ctx.beginPath();
        ctx.arc(centerX+shadowOffset, centerY+shadowOffset, width/2 - shadowOffset, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        */

        for ( var i = 0; i < t.data.length; i++ )
        {
            label = t.data[i].label;
            value = t.data[i].value;
            color = t.data[i].color;

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#FFFFFF";
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, centerY, lastend, lastend + (Math.PI * 2 * (value / total)), false);
            ctx.lineTo(centerX, centerY);
            ctx.fill();
            ctx.stroke();

            lastend += Math.PI * 2 * (value / total);

        }

    }

    createCanvas();
    createPie();
}

/*
CanvasPieChart.prototype.createCanvas = function()
{
    alert(this.containerElem);
    
};
*/