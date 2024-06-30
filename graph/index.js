graphboard = null
graph = null
zoommultiplier = 1
function init() {
    graphboard = document.getElementById("graphboard")
    graph = graphboard.getContext('2d')
    graphmargin = [[0,0],[parseInt(graphboard.getAttribute("width"))/2,parseInt(graphboard.getAttribute("height"))/2],[parseInt(graphboard.getAttribute("width")),parseInt(graphboard.getAttribute("height"))]]
    addEventListener(("keydown"),(e)=>{
        if (e.key == "w") { graphmargin[1][1]+=1/zoommultiplier; graphreset(); graphs();}
        if (e.key == "s") { graphmargin[1][1]-=1/zoommultiplier; graphreset(); graphs();}
        if (e.key == "d") { graphmargin[1][0]-=1/zoommultiplier; graphreset(); graphs();}
        if (e.key == "a") { graphmargin[1][0]+=1/zoommultiplier; graphreset(); graphs();}
    })
}
function graphreset() {
    graph.reset()
    canvasaxis()
}
/*function getinput() {
    return (x) => {return math.evaluate(document.getElementById("function_part").value.replaceAll("x","(" + x + ")"))};
}*/
function canvasaxis() {
    graph.beginPath()
    graph.setLineDash([])
    graph.strokeStyle = "red"
    graph.moveTo(graphmargin[1][0], graphmargin[0][1])
    graph.lineTo(graphmargin[1][0], graphmargin[2][1])
    graph.moveTo(graphmargin[0][1], graphmargin[1][1])
    graph.lineTo(graphmargin[2][1], graphmargin[1][1])
    graph.stroke()
}
function getgraphlist() {
    let a = []
    let co = []
    let c = document.getElementsByClassName("functionpart")
    for (let x = 0; x < c.length; x++) {
        let k = c.item(x).value
        co.push(c.item(x).getAttribute("graphcolor"))
        if (k.replaceAll(" ","") != "")
            a.push(k)
    }
    return [a,co];
}
function randomize(min,max) {
    return min + Math.floor(Math.random()*(max-min))
}
function graphs(graphlist = getgraphlist()[0], graphcolors = getgraphlist()[1]) {
    graphreset()
    for (let y = 0; y < graphlist.length; y++) {
        let func = function (x,formula) {return math.evaluate(formula.replaceAll("x","(" + x + ")"))};
        drawgraph(func,graphlist[y],graphcolors[y])
    }
}
function drawgraph(func,formula,color=`rgb(${randomize(0,200)},${randomize(0,200)},${randomize(0,200)})`) {
    graph.beginPath()
    graph.setLineDash([])
    graph.strokeStyle = color
    for (let x = 0; x < graphmargin[2][0]-1; x++) {
        try {
            cx = (x-graphmargin[1][0])
            graph.moveTo(x,graphmargin[1][1]-func(zoommultiplier * cx , formula))
            graph.lineTo(x+1,graphmargin[1][1]-func(zoommultiplier * (cx+1) , formula))
        } catch {
            console.error("Oops! Undefined!")
        }
    }
    graph.stroke()
}