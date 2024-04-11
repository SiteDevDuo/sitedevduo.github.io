function randomize(min,max) {
    return min + Math.floor(Math.random()*(max-min+1))
}
totalcards = 0
pickmeup = ""
pickmeuplogic = false
if (localStorage.getItem("SET_Contrast") == null) SETTINGS_Contrast = 1
else SETTINGS_Contrast = localStorage.getItem("SET_Contrast")
if (localStorage.getItem("SET_Brightness") == null) SETTINGS_Brightness = 1
else SETTINGS_Brightness = localStorage.getItem("SET_Brightness")
if (localStorage.getItem("SET_Scale") == null) SETTINGS_Scale = 1
else SETTINGS_Scale = localStorage.getItem("SET_Scale")
if (localStorage.getItem("SET_Width") == null) SETTINGS_Width = window.innerWidth
else SETTINGS_Width = localStorage.getItem("SET_Width")
if (localStorage.getItem("SET_Height") == null) SETTINGS_Height = window.innerHeight
else SETTINGS_Height = localStorage.getItem("SET_Height")
cardcount = 0
PlayerLeftHealth = 100
PlayerRightHealth = 100
if (randomize(0,1) == 1)
    Turn = true // True means left side turn
else
    Turn = false // False means right side turn
Step = 0
function applyhealth(health,damage) {
    if (health >= damage)
        return [health-damage,0]
    else
        return [0, damage-health]
    }
Limiter = 3
loh = ""
lmh = ""
roh = ""
rmh = ""
function KillCard(item) {
    item.className += " Killed"
    for (let index = 0; index < item.childNodes.length; index++) {
        if (item.childNodes.item(index).className == "cardoverlay")
            item.childNodes.item(index).remove()
    }
    setTimeout(() => {
        item.remove()
    },1000)
}
function nextround() {
    Step++
    if (Step == 2 || Step == 1) {
        if (Turn) {
            let a = document.createElement("div")
            a.className = "rightsideoverlay"
            document.getElementById("rightside").append(a)
            try{document.getElementsByClassName("leftsideoverlay").item(0).remove()} catch(e) {console.log(e)}
        } else {
            let a = document.createElement("div")
            a.className = "leftsideoverlay"
            document.getElementById("leftside").append(a)
            try{document.getElementsByClassName("rightsideoverlay").item(0).remove()} catch(e) {console.log(e)}
        }
        Limiter = 3
        if (StopGeneratingCards == false && document.getElementsByClassName("logocardpos").length == 0)
            document.getElementById("technicalbackground").append(logocard())
        if (Turn) Turn = false
        else Turn = true
    }
    if (Step == 3) {
        try {rmh = document.getElementById("right_mainhand").childNodes.item(1).childNodes.item(1)} catch(e) {console.log(e)}
        try {roh = document.getElementById("right_offhand").childNodes.item(1).childNodes.item(1)} catch(e) {console.log(e)}
        try {lmh = document.getElementById("left_mainhand").childNodes.item(1).childNodes.item(1)} catch(e) {console.log(e)}
        try {loh = document.getElementById("left_offhand").childNodes.item(1).childNodes.item(1)} catch(e) {console.log(e)}
        let leftmaindamage = 0; let leftoffdamage = 0; let rightmaindamage = 0; let rightoffdamage = 0;
        if (document.getElementById("left_mainhand").childElementCount > 1) {leftmaindamage = parseInt(lmh.childNodes.item(0).childNodes.item(1).textContent); }
        if (document.getElementById("left_offhand").childElementCount > 1) {leftoffdamage = parseInt(loh.childNodes.item(0).childNodes.item(1).textContent); }
        if (document.getElementById("right_mainhand").childElementCount > 1) {rightmaindamage = parseInt(rmh.childNodes.item(0).childNodes.item(1).textContent); }
        if (document.getElementById("right_offhand").childElementCount > 1) {rightoffdamage = parseInt(roh.childNodes.item(0).childNodes.item(1).textContent); }
        if (document.getElementById("left_action").childElementCount > 1) {
            let a = document.getElementById("left_action").childNodes.item(1).childNodes.item(0).childNodes.item(0).textContent
            if (a == "Barrier"){
                PlayerLeftHealth += 20
            }
            if (a == "Reverse") {
                leftmaindamage += rightmaindamage
                leftoffdamage += rightoffdamage
                rightmaindamage = 0
                rightoffdamage = 0
            }
            if (a == "Robber") {
                let b = roh.parentNode.cloneNode()
                b.innerHTML = roh.parentNode.innerHTML
                roh.parentNode.remove()
                document.getElementById("leftcards").append(b)
            }
            if (a == "Earthquake") {
                let dealdmg = (dmg,obj)=>{
                    let b = showoffdamage(dmg)
                    b.style.left = (obj.offsetLeft).toString() + "px"
                    b.style.top = (obj.offsetTop).toString() + "px"
                    obj.parentNode.append(b)
                }
                lmh.childNodes.item(2).childNodes.item(1).textContent = parseInt(lmh.childNodes.item(2).childNodes.item(1).textContent)-5
                loh.childNodes.item(2).childNodes.item(1).textContent = parseInt(loh.childNodes.item(2).childNodes.item(1).textContent)-5
                setTimeout(()=>{dealdmg(-5,lmh.parentNode.parentNode)
                dealdmg(-5,loh.parentNode.parentNode)
                dealdmg(-5,rmh.parentNode.parentNode)
                dealdmg(-5,roh.parentNode.parentNode)},1000)
                if (rmh.childNodes.item(1).childNodes.item(1).textContent != "∞") rmh.childNodes.item(2).childNodes.item(1).textContent = parseInt(rmh.childNodes.item(2).childNodes.item(1).textContent)-5
                if (roh.childNodes.item(1).childNodes.item(1).textContent != "∞") roh.childNodes.item(2).childNodes.item(1).textContent = parseInt(roh.childNodes.item(2).childNodes.item(1).textContent)-5
            }
            if (a == "Forced Deal") {
                let cardleft = document.getElementById("leftcards").childNodes.item(randomize(0,document.getElementById("leftcards").childNodes.length-1))
                let cardright = document.getElementById("rightcards").childNodes.item(randomize(0,document.getElementById("leftcards").childNodes.length-1))
                document.getElementById("leftcards").append(cardright)
                document.getElementById("rightcards").append(cardleft)
            }
            if (a == "Molotov") {
                let dealdmg = (dmg,obj)=>{
                    let b = showoffdamage(dmg)
                    b.style.left = (obj.offsetLeft).toString() + "px"
                    b.style.top = (obj.offsetTop).toString() + "px"
                    obj.parentNode.append(b)
                }
                try{rmh.childNodes.item(2).childNodes.item(1).textContent = parseInt(rmh.childNodes.item(2).childNodes.item(1).textContent)-3} catch {}
                try{roh.childNodes.item(2).childNodes.item(1).textContent = parseInt(roh.childNodes.item(2).childNodes.item(1).textContent)-3} catch {}
                setTimeout(()=>{dealdmg(-3,rmh.parentNode.parentNode)
                dealdmg(-3,roh.parentNode.parentNode)},1000)
                try{if (rmh.childNodes.item(1).childNodes.item(1).textContent != "∞") rmh.childNodes.item(1).childNodes.item(1).textContent = parseInt(rmh.childNodes.item(1).childNodes.item(1).textContent)/2} catch(e) {console.log(e)}
                try{if (roh.childNodes.item(1).childNodes.item(1).textContent != "∞") roh.childNodes.item(1).childNodes.item(1).textContent = parseInt(roh.childNodes.item(1).childNodes.item(1).textContent)/2} catch(e) {console.log(e)}
            }
            if (a == "Nuke") {
                let dealdmg = (dmg,obj)=>{
                    let b = showoffdamage(dmg)
                    b.style.left = (obj.offsetLeft).toString() + "px"
                    b.style.top = (obj.offsetTop).toString() + "px"
                    obj.parentNode.append(b)
                }
                try{KillCard(loh.parentNode)}catch(e){console.log(e)}
                try{KillCard(rmh.parentNode)}catch(e){console.log(e)}
                try{KillCard(roh.parentNode)}catch(e){console.log(e)}
                try{KillCard(lmh.parentNode)}catch(e){console.log(e)}
                leftmaindamage += 30
                rightmaindamage += 30
                try{dealdmg(-1000,loh.parentNode.parentNode)}catch(e){console.log(e)}
                try{dealdmg(-1000,rmh.parentNode.parentNode)}catch(e){console.log(e)}
                try{dealdmg(-1000,lmh.parentNode.parentNode)}catch(e){console.log(e)}
                try{dealdmg(-1000,roh.parentNode.parentNode)}catch(e){console.log(e)}
            }
            document.getElementById("left_action").childNodes.item(1).remove()
        }
        if (document.getElementById("right_action").childElementCount > 1) {
            let a = document.getElementById("right_action").childNodes.item(1).childNodes.item(0).childNodes.item(0).textContent
            if (a == "Barrier")
                PlayerRightHealth += 20
            if (a == "Reverse") {
                rightmaindamage += leftmaindamage
                rightoffdamage += leftoffdamage
                leftmaindamage = 0
                leftoffdamage = 0
            }
            if (a == "Forced Deal") {
                let cardleft = document.getElementById("leftcards").childNodes.item(randomize(0,document.getElementById("leftcards").childNodes.length-1))
                let cardright = document.getElementById("rightcards").childNodes.item(randomize(0,document.getElementById("rightcards").childNodes.length-1))
                document.getElementById("leftcards").append(cardright)
                document.getElementById("rightcards").append(cardleft)
            }
            if (a == "Robber") {
                let b = loh.parentNode.cloneNode()
                b.innerHTML = loh.parentNode.innerHTML
                loh.parentNode.remove()
                document.getElementById("rightcards").append(b)
            }
            if (a == "Earthquake") {
                let dealdmg = (dmg,obj)=>{
                    let b = showoffdamage(dmg)
                    b.style.left = (obj.offsetLeft).toString() + "px"
                    b.style.top = (obj.offsetTop).toString() + "px"
                    obj.parentNode.append(b)
                }
                lmh.childNodes.item(2).childNodes.item(1).textContent = parseInt(lmh.childNodes.item(2).childNodes.item(1).textContent)-5
                loh.childNodes.item(2).childNodes.item(1).textContent = parseInt(loh.childNodes.item(2).childNodes.item(1).textContent)-5
                setTimeout(()=>{dealdmg(-5,lmh.parentNode.parentNode)
                    dealdmg(-5,loh.parentNode.parentNode)
                    dealdmg(-5,rmh.parentNode.parentNode)
                    dealdmg(-5,roh.parentNode.parentNode)},1000)
                rmh.childNodes.item(2).childNodes.item(1).textContent = parseInt(rmh.childNodes.item(2).childNodes.item(1).textContent)-5
                roh.childNodes.item(2).childNodes.item(1).textContent = parseInt(roh.childNodes.item(2).childNodes.item(1).textContent)-5
                if (parseInt(lmh.childNodes.item(2).childNodes.item(1).textContent) <= 0) {KillCard(lmh.parentNode)}
                if (parseInt(loh.childNodes.item(2).childNodes.item(1).textContent) <= 0) {KillCard(loh.parentNode)}
                if (parseInt(rmh.childNodes.item(2).childNodes.item(1).textContent) <= 0) {KillCard(rmh.parentNode)}
                if (parseInt(roh.childNodes.item(2).childNodes.item(1).textContent) <= 0) {KillCard(roh.parentNode)}
            }
            if (a == "Molotov") {
                let dealdmg = (dmg,obj)=>{
                    let b = showoffdamage(dmg)
                    b.style.left = (obj.offsetLeft).toString() + "px"
                    b.style.top = (obj.offsetTop).toString() + "px"
                    obj.parentNode.append(b)
                }
                setTimeout(()=>{dealdmg(-3,lmh.parentNode.parentNode)
                dealdmg(-3,loh.parentNode.parentNode)},1000)
                try{lmh.childNodes.item(2).childNodes.item(1).textContent = parseInt(lmh.childNodes.item(2).childNodes.item(1).textContent)-3} catch {}
                try{loh.childNodes.item(2).childNodes.item(1).textContent = parseInt(loh.childNodes.item(2).childNodes.item(1).textContent)-3} catch {}
                try{if (lmh.childNodes.item(1).childNodes.item(1).textContent != "∞") lmh.childNodes.item(1).childNodes.item(1).textContent = parseInt(lmh.childNodes.item(1).childNodes.item(1).textContent)/2} catch(e) {console.log(e)}
                try{if (loh.childNodes.item(1).childNodes.item(1).textContent != "∞") loh.childNodes.item(1).childNodes.item(1).textContent = parseInt(loh.childNodes.item(1).childNodes.item(1).textContent)/2} catch(e) {console.log(e)}
            }
            if (a == "Nuke") {
                let dealdmg = (dmg,obj)=>{
                    let b = showoffdamage(dmg)
                    b.style.left = (obj.offsetLeft).toString() + "px"
                    b.style.top = (obj.offsetTop).toString() + "px"
                    obj.parentNode.append(b)
                }
                try{KillCard(loh.parentNode)}catch(e){console.log(e)}
                try{KillCard(rmh.parentNode)}catch(e){console.log(e)}
                try{KillCard(roh.parentNode)}catch(e){console.log(e)}
                try{KillCard(lmh.parentNode)}catch(e){console.log(e)}
                PlayerLeftHealth-=30
                PlayerRightHealth-=30
                try{dealdmg(-1000,loh.parentNode.parentNode)}catch(e){console.log(e)}
                try{dealdmg(-1000,rmh.parentNode.parentNode)}catch(e){console.log(e)}
                try{dealdmg(-1000,lmh.parentNode.parentNode)}catch(e){console.log(e)}
                try{dealdmg(-1000,roh.parentNode.parentNode)}catch(e){console.log(e)}
            }
            document.getElementById("right_action").childNodes.item(1).remove()
        }
        if (document.getElementById("right_mainhand").childElementCount > 1) {
            let a = applyhealth(parseInt(rmh.childNodes.item(2).childNodes.item(1).textContent),parseInt(leftmaindamage))

            let b = showoffdamage(a[0] - parseInt(rmh.childNodes.item(2).childNodes.item(1).textContent))
            b.style.left = (rmh.parentNode.parentNode.offsetLeft).toString() + "px"
            b.style.top = (rmh.parentNode.parentNode.offsetTop).toString() + "px"
            rmh.parentNode.parentNode.parentNode.append(b)

            if (a[0] == 0) KillCard(rmh.parentNode)
            else rmh.childNodes.item(2).childNodes.item(1).textContent = a[0];
            leftmaindamage = a[1]
            if (rmh.childNodes.item(1).childNodes.item(1).textContent != "∞")
            if (parseInt(rmh.childNodes.item(1).childNodes.item(1).textContent) > 1)
                rmh.childNodes.item(1).childNodes.item(1).textContent = parseInt(rmh.childNodes.item(1).childNodes.item(1).textContent)-1
            else
                KillCard(rmh.parentNode)
        }
        if (document.getElementById("right_offhand").childElementCount > 1) {
            let a = applyhealth(parseInt(roh.childNodes.item(2).childNodes.item(1).textContent),parseInt(leftoffdamage))

            let b = showoffdamage(a[0] - parseInt(roh.childNodes.item(2).childNodes.item(1).textContent))
            b.style.left = (roh.parentNode.parentNode.offsetLeft).toString() + "px"
            b.style.top = (roh.parentNode.parentNode.offsetTop).toString() + "px"
            roh.parentNode.parentNode.parentNode.append(b)

            if (a[0] == 0) KillCard(roh.parentNode)
            else roh.childNodes.item(2).childNodes.item(1).textContent = a[0];
            leftoffdamage = a[1]
            if (roh.childNodes.item(1).childNodes.item(1).textContent != "∞")
            if (parseInt(roh.childNodes.item(1).childNodes.item(1).textContent) > 1)
                roh.childNodes.item(1).childNodes.item(1).textContent = parseInt(roh.childNodes.item(1).childNodes.item(1).textContent)-1
            else
                KillCard(roh.parentNode)
        }
        if (document.getElementById("left_mainhand").childElementCount > 1) {
            let a = applyhealth(parseInt(lmh.childNodes.item(2).childNodes.item(1).textContent),parseInt(rightmaindamage))
            
            let b = showoffdamage(a[0] - parseInt(lmh.childNodes.item(2).childNodes.item(1).textContent))
            b.style.left = (lmh.parentNode.parentNode.offsetLeft).toString() + "px"
            b.style.top = (lmh.parentNode.parentNode.offsetTop).toString() + "px"
            lmh.parentNode.parentNode.parentNode.append(b)

            if (a[0] == 0) KillCard(lmh.parentNode)
            else lmh.childNodes.item(2).childNodes.item(1).textContent = a[0];
            rightmaindamage = a[1]
            if (lmh.childNodes.item(1).childNodes.item(1).textContent != "∞")
            if (parseInt(lmh.childNodes.item(1).childNodes.item(1).textContent) > 1)
                lmh.childNodes.item(1).childNodes.item(1).textContent = parseInt(lmh.childNodes.item(1).childNodes.item(1).textContent)-1
            else
                KillCard(lmh.parentNode)
        }
        if (document.getElementById("left_offhand").childElementCount > 1) {
            let a = applyhealth(parseInt(loh.childNodes.item(2).childNodes.item(1).textContent),parseInt(rightoffdamage))
            
            let b = showoffdamage(a[0] - parseInt(loh.childNodes.item(2).childNodes.item(1).textContent))
            b.style.left = (loh.parentNode.parentNode.offsetLeft).toString() + "px"
            b.style.top = (loh.parentNode.parentNode.offsetTop).toString() + "px"
            loh.parentNode.parentNode.parentNode.append(b)

            if (a[0] == 0) KillCard(loh.parentNode)
            else loh.childNodes.item(2).childNodes.item(1).textContent = a[0];
            rightoffdamage = a[1]
            if (loh.childNodes.item(1).childNodes.item(1).textContent != "∞")
            if (parseInt(loh.childNodes.item(1).childNodes.item(1).textContent) > 1)
                loh.childNodes.item(1).childNodes.item(1).textContent = parseInt(loh.childNodes.item(1).childNodes.item(1).textContent)-1
            else
                KillCard(loh.parentNode)
        }
        if (document.getElementById("right_mainhand").childElementCount > 1 && leftoffdamage > 0) {
            let a = applyhealth(parseInt(rmh.childNodes.item(2).childNodes.item(1).textContent),parseInt(leftoffdamage))

            setTimeout(()=>{let b = showoffdamage(a[0] - parseInt(rmh.childNodes.item(2).childNodes.item(1).textContent))
            b.style.left = (rmh.parentNode.parentNode.offsetLeft).toString() + "px"
            b.style.top = (rmh.parentNode.parentNode.offsetTop).toString() + "px"
            rmh.parentNode.parentNode.parentNode.append(b)},500)

            if (a[0] == 0) KillCard(rmh.parentNode)
            else rmh.childNodes.item(2).childNodes.item(1).textContent = a[0];
            leftoffdamage = a[1]
        }
        if (document.getElementById("right_offhand").childElementCount > 1 && leftmaindamage > 0) {
            let a = applyhealth(parseInt(roh.childNodes.item(2).childNodes.item(1).textContent),parseInt(leftmaindamage))

            setTimeout(()=>{let b = showoffdamage(a[0] - parseInt(roh.childNodes.item(2).childNodes.item(1).textContent))
            b.style.left = (roh.parentNode.parentNode.offsetLeft).toString() + "px"
            b.style.top = (roh.parentNode.parentNode.offsetTop).toString() + "px"
            roh.parentNode.parentNode.parentNode.append(b)},500)

            if (a[0] == 0) KillCard(roh.parentNode)
            else roh.childNodes.item(2).childNodes.item(1).textContent = a[0];
            leftmaindamage = a[1]
        }
        if (document.getElementById("left_mainhand").childElementCount > 1 && rightoffdamage > 0) {
            let a = applyhealth(parseInt(lmh.childNodes.item(2).childNodes.item(1).textContent),parseInt(rightoffdamage))

            setTimeout(()=>{let b = showoffdamage(a[0] - parseInt(lmh.childNodes.item(2).childNodes.item(1).textContent))
            b.style.left = (lmh.parentNode.parentNode.offsetLeft).toString() + "px"
            b.style.top = (lmh.parentNode.parentNode.offsetTop).toString() + "px"
            lmh.parentNode.parentNode.parentNode.append(b)},500)

            if (a[0] == 0) KillCard(lmh.parentNode);
            else lmh.childNodes.item(2).childNodes.item(1).textContent = a[0];
            rightoffdamage = a[1]
        }
        if (document.getElementById("left_offhand").childElementCount > 1 && rightmaindamage > 0) {
            let a = applyhealth(parseInt(loh.childNodes.item(2).childNodes.item(1).textContent),parseInt(rightmaindamage))

            setTimeout(()=>{let b = showoffdamage(a[0] - parseInt(loh.childNodes.item(2).childNodes.item(1).textContent))
            b.style.left = (loh.parentNode.parentNode.offsetLeft).toString() + "px"
            b.style.top = (loh.parentNode.parentNode.offsetTop).toString() + "px"
            loh.parentNode.parentNode.parentNode.append(b)},500)

            if (a[0] == 0) KillCard(loh.parentNode);
            else loh.childNodes.item(2).childNodes.item(1).textContent = a[0];
            rightmaindamage = a[1]
        }
        PlayerRightHealth -= (leftmaindamage+leftoffdamage)
        let b = showoffdamage(-leftmaindamage-leftoffdamage)
        b.style.left = (document.getElementById("righthealth").offsetLeft).toString() + "px"
        b.style.top = (document.getElementById("righthealth").offsetTop).toString() + "px"
        document.getElementById("righthealth").parentNode.append(b)
        PlayerLeftHealth -= (rightmaindamage+rightoffdamage)
        let c = showoffdamage(-rightmaindamage-rightoffdamage)
        c.style.left = (document.getElementById("lefthealth").offsetLeft).toString() + "px"
        c.style.top = (document.getElementById("lefthealth").offsetTop).toString() + "px"
        document.getElementById("lefthealth").parentNode.append(c)
        stats()
        Step = 0
        setTimeout(()=>{
            let a = document.getElementsByClassName("DamageIndicator")
            for (let x = 0; x < a.length; x++)
                a.item(x).remove()
        },6000)
        if (PlayerLeftHealth <= 0 || PlayerRightHealth <= 0) {
            let a = document.createElement("div")
            let k = document.createElement("div")
            a.className = "resultoverlayleft"
            let b = document.createElement("h1")
            k.append(b)
            if (PlayerRightHealth <= 0) {b.textContent = "Victory"; b.style.color = "green";}
            else {b.textContent = "Defeat"; b.style.color = "red";}
            a.append(k)
            document.getElementById("technicalbackground").append(a)
            let c = document.createElement("div")
            c.className = "resultoverlayright"
            let kk = document.createElement("div")
            let d = document.createElement("h1")
            kk.append(d)
            if (PlayerLeftHealth <= 0) {d.textContent = "Victory"; d.style.color = "green";}
            else {d.textContent = "Defeat"; d.style.color = "red";}
            c.append(kk)
            document.getElementById("technicalbackground").append(c)
            let o = document.createElement("button")
            o.className = "retrybutton"
            o.setAttribute("onclick","window.location.reload()")
            let j = document.createElement("img")
            j.src = "retry.png"
            o.append(j)
            document.getElementById("technicalbackground").append(o)
        }
        nextround()
    }

}
carddefaults = [ // Card behavior, Image, Name, Attack, Use, Health, Rarity(Weight(The Bigger = The Easier To Obtain))
    ["damageful","pistol.png","Pistol",15,5,1,5],
    ["damageful","shotgun.png","Shotgun",20,2,10,2],
    ["damageful","uzi.png","UZI",10,50,10,4],
    ["damageful","spear.png","Spear",14,6,3,4],
    ["damageful","katana.png","Katana",15,3,15,5],
    ["damageful","mace.png","Mace",12,8,5,4],
    ["weapon","sword.png","Sword",8,"∞",10,8],
    ["weapon","dagger.png","Dagger",5,"∞",15,9],
    ["weapon","axe.png","Axe",10,"∞",8,7],
    ["weapon","bat.png","Bat",8,"∞",5,10],
    ["legendary","cannon.png","Cannon",35,1,15,2],
    ["legendary","catapult.png","Catapult",30,3,10,3],
    ["legendary","bazo.png","RPG",35,1,5,1],
    ["legendary","wand.png","Magic Wand",20,20,2,1],
    ["legendary","reaper.png","Reaper",15,6,30,1],
    ["defensive","shield.png","Shield",1,"∞",30,6],
    ["defensive","demon.png","Devil Armor",-5,20,100,1],
    ["other","bow.png","Bow",5,32,20,5],
]
actioncards = [ // Card Color, Image, Card Name, Card Description, Rarity(Weight(The Bigger = The Easier To Obtain))
    ["aqua","robbery.png","Robber",`Secretly steal your enemy's offhand item after the battle O.o`,2],
    ["orange","force_field.png","Barrier",`Creates a barrier around you which protects you from the next 20 damage`,4],
    ["pink","reverse.png","Reverse",`Return the damage which your enemy was about to deal to you to itself`, 5],
    ["crimson","earthquake.png","Earthquake",`Shakes the ground, dealing 5 damage to every held card by players`, 3],
    ["red","cocktail.png","Molotov",`deals 3 damage to every held card by player, and halves use counts of enemy `, 3],
    ["chocolate","forceddeal.png","Forced Deal",`Swap a random card of yours with a random one from enemy(steal if enemy has none)`, 3],
    ["green","nuke.png","Nuke",`Demolishes all held weapons and deals 30 damage to both players`, 1],
]
function ObjCollision(obj1, obj2) {
    obj1.offsetBottom = obj1.offsetTop + obj1.offsetHeight;
    obj1.offsetRight = obj1.offsetLeft + obj1.offsetWidth;
    obj2.offsetBottom = obj2.offsetTop + obj2.offsetHeight;
    obj2.offsetRight = obj2.offsetLeft + obj2.offsetWidth;
    return !((obj1.offsetBottom < obj2.offsetTop) || (obj1.offsetTop > obj2.offsetBottom) || (obj1.offsetRight < obj2.offsetLeft) || (obj1.offsetLeft > obj2.offsetRight))
}
function areacheck(item) {
    let a = document.getElementById("leftcards")
    let b = document.getElementById("rightcards")
    let c = document.getElementById("left_offhand")
    let d = document.getElementById("left_mainhand")
    let e = document.getElementById("right_offhand")
    let f = document.getElementById("right_mainhand")
    let g = document.getElementById("left_action")
    let h = document.getElementById("right_action")
    let appendage = (item,obj) => {
        item.style = ""
        obj.append(item)
    }; 
    if(ObjCollision(item,c) && item.parentNode.className=="leftside" && item.getAttribute("CardType") == "Weapon" && c.childElementCount <= 1) appendage(item,c); 
    else if(ObjCollision(item,d) && item.parentNode.className=="leftside" && item.getAttribute("CardType") == "Weapon" && d.childElementCount <= 1) appendage(item,d); 
    else if(ObjCollision(item,e) && item.parentNode.className=="rightside" && item.getAttribute("CardType") == "Weapon" && e.childElementCount <= 1) appendage(item,e); 
    else if(ObjCollision(item,f) && item.parentNode.className=="rightside" && item.getAttribute("CardType") == "Weapon" && f.childElementCount <= 1) appendage(item,f);
    else if(ObjCollision(item,g) && item.parentNode.className=="leftside" && item.getAttribute("CardType") == "Action" && g.childElementCount <= 1) appendage(item,g);
    else if(ObjCollision(item,h) && item.parentNode.className=="rightside" && item.getAttribute("CardType") == "Action" && h.childElementCount <= 1) appendage(item,h);
    else if(ObjCollision(item,a) && item.parentNode.className=="leftside") appendage(item,a);
    else if(ObjCollision(item,b) && item.parentNode.className=="rightside") appendage(item,b);
    stats()
}
function stats() {
    let c = document.getElementById("left_offhand")
    let d = document.getElementById("left_mainhand")
    let e = document.getElementById("right_offhand")
    let f = document.getElementById("right_mainhand")
    dmgloh = 0; dmgroh = 0; dmglmh = 0; dmgrmh = 0 
    hlthloh = 0; hlthroh = 0; hlthlmh = 0; hlthrmh = 0 
    try {hlthloh = c.childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(1).textContent} catch {}
    try {hlthlmh = d.childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(1).textContent} catch {}
    try {hlthroh = e.childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(1).textContent} catch {}
    try {hlthrmh = f.childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(1).textContent} catch {}
    try {dmgloh = c.childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(1).textContent} catch {}
    try {dmglmh = d.childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(1).textContent} catch {}
    try {dmgroh = e.childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(1).textContent} catch {}
    try {dmgrmh = f.childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(1).textContent} catch {}
    document.getElementById("rightdefense").childNodes.item(0).textContent = parseInt(hlthrmh) + parseInt(hlthroh)
    document.getElementById("leftdefense").childNodes.item(0).textContent = parseInt(hlthlmh) + parseInt(hlthloh)
    document.getElementById("rightattack").childNodes.item(0).textContent = parseInt(dmgrmh) + parseInt(dmgroh)
    document.getElementById("leftattack").childNodes.item(0).textContent = parseInt(dmglmh) + parseInt(dmgloh)
    document.getElementById("lefthealth").childNodes.item(0).textContent = PlayerLeftHealth
    document.getElementById("righthealth").childNodes.item(0).textContent = PlayerRightHealth
}
function selectme(event) {
    let a = event.target.parentNode;
    if (a.parentNode.id == "leftcards"
        || a.parentNode.id == "rightcards"
        || a.parentNode.id == "left_action"
        || a.parentNode.id == "right_action"
        || a.parentNode.id == "left_mainhand"
        || a.parentNode.id == "left_offhand"
        || a.parentNode.id == "right_mainhand"
        || a.parentNode.id == "right_offhand") {
        let b = a.cloneNode()
        b.innerHTML = a.innerHTML
        a.parentNode.parentNode.append(b)
        a.remove()
        if (b.parentNode.className == "leftside")
            pickmeuplogic = false
        else if (b.parentNode.className == "rightside")
            pickmeuplogic = true
    } else {
        if (a.parentNode.className == "leftside")
            pickmeuplogic = false
        else if (a.parentNode.className == "rightside")
            pickmeuplogic = true
    }
    if (pickmeup == '') {
        pickmeup = a.id;
    }
    else {
        areacheck(document.getElementById(pickmeup))
        pickmeup = '';
        pickmeuplogic = false
    }
}
StopGeneratingCards = false
function GetPercentage() {
    let a = 0
    let b = ""
    let c = 0
    actioncards.forEach((e)=>{a += e[4]})
    carddefaults.forEach((e)=>{c += e[6]})
    carddefaults.forEach((e)=>{b+=`Weapon: ${e[2]} ${parseFloat(parseInt(e[6]/c*50000)/1000)}%\n`})
    actioncards.forEach((e)=>{b+=`Action: ${e[2]} ${parseFloat(parseInt(e[4]/a*50000)/1000)}%\n`})
    return b
}
function GetARandomCard() {
    let a = 0
    let b = ""
    if (randomize(0,1) == 1){actioncards.forEach((e)=>{a += e[4]}); b = "Action"}
    else{carddefaults.forEach((e)=>{a += e[6]}); b = "Weapon"}
    let c = randomize(0,a); StillNotSet = true
    if (b == "Action") {actioncards.forEach((e)=>{if (c-e[4] > 0) c -= e[4]; else if(StillNotSet) { Cardio = actioncardgen(e[0],e[1],e[2],e[3]); StillNotSet = false;}})}
    else {carddefaults.forEach((e)=>{if (c-e[6] > 0) c -= e[6]; else if(StillNotSet) {Cardio = cardgenerator(e[0],e[1],e[2],e[3],e[4],e[5]); StillNotSet = false;}})}
    try{return Cardio} catch(e) {console.log(e); return "Somehow Something Somewhere breaksomely brokesome somethat somehow issome impossomble"}
}
function addnewcard(a) {
    if (totalcards >= 50) {
        a.target.parentNode.remove()
        StopGeneratingCards = true
    }
    if (Limiter >= 5) {
        a.target.parentNode.remove()
    }
    document.getElementById("leftcards").append(GetARandomCard())
    document.getElementById("rightcards").append(GetARandomCard())
    totalcards+=2;
    Limiter++;
}
function cardgenerator(rarity,image,name,atk,use,hp) {
    let a = document.createElement("div")
    a.setAttribute("CardType","Weapon")
    a.className = "card"
    let b = document.createElement("div")
    b.className = "card_upperpart"
    b.setAttribute("rarity",rarity)
    let c = document.createElement("div")
    c.className = "card_imagecontainer"
    let d = document.createElement("img")
    d.src = image
    let e = document.createElement("h2")
    e.textContent = name
    c.append(d); b.append(c); b.append(e)
    let f = document.createElement("div")
    f.className = "card_lowerpart"
    let g = document.createElement("h2")
    g.textContent = "⚔"
    let h = document.createElement("p")
    h.textContent = atk
    g.append(h); f.append(g)
    let i = document.createElement("h2")
    i.textContent = "⚙"
    let j = document.createElement("p")
    j.textContent = use
    i.append(j); f.append(i)
    let k = document.createElement("h2")
    k.textContent = "♥"
    let l = document.createElement("p")
    l.textContent = hp
    k.append(l); f.append(k)
    a.append(b); a.append(f)
    a.id = `CardNumber-${cardcount}`
    let q = document.createElement("div")
    q.className = "cardoverlay"; q.setAttribute("onclick","selectme(event)");
    q.setAttribute("onmousedown","if (event.button == 1) getdetail(event)")
    a.append(q)
    cardcount++;
    return a;
}
function getdetail(a) {
    if (a.target.parentNode.getAttribute("CardType") == "Action") {
        alert(`${a.target.parentNode.childNodes.item(0).childNodes.item(0).textContent} : ${a.target.parentNode.childNodes.item(2).childNodes.item(0).textContent}`)
    } else if (a.target.parentNode.getAttribute("CardType") == "Weapon") {
        alert(`${a.target.parentNode.childNodes.item(0).childNodes.item(1).textContent}\n⚔${a.target.parentNode.childNodes.item(1).childNodes.item(0).childNodes.item(1).textContent} ⚙${a.target.parentNode.childNodes.item(1).childNodes.item(1).childNodes.item(1).textContent} ♥${a.target.parentNode.childNodes.item(1).childNodes.item(2).childNodes.item(1).textContent}`)
    }
}
function actioncardgen(color,image,name,description) {
    let a = document.createElement("div")
    a.setAttribute("CardType","Action")
    a.className = "card";
    let b = document.createElement("div")
    b.className = "actioncard_upper"
    let c = document.createElement("h2")
    c.textContent = name
    b.append(c); a.append(b)
    let d = document.createElement("div")
    d.className = "actioncard_middle"
    d.style = `background-color: ${color};`;
    let e = document.createElement("img")
    e.src = image; d.append(e); a.append(d)
    let f = document.createElement("div")
    f.className = "actioncard_lower"
    let g = document.createElement("p")
    g.textContent = description
    f.append(g); a.append(f)
    a.id = `CardNumber-${cardcount}` 
    let q = document.createElement("div")
    q.className = "cardoverlay"; q.setAttribute("onclick","selectme(event)");
    q.setAttribute("onmousedown","if (event.button == 1) getdetail(event)")
    a.append(q)
    cardcount++
    return a
}
function logocard() {
    let p = document.createElement("div")
    p.setAttribute("CardType","Logo")
    p.className = "card logocardpos"; p.id = `CardNumber-${cardcount}`
    let q = document.createElement("div")
    q.className = "LogoCardEntirely"
    let o = document.createElement("img"); o.src = "logo.png"
    q.append(o)
    p.append(q)
    let k = document.createElement("div")
    k.className = "cardoverlay";
    k.setAttribute("onmousedown","if (event.button == 1) alert(`This is the logo card`)")
    k.setAttribute("onclick","addnewcard(event)")
    p.append(k)
    p.id = `CardNumber-${cardcount}` 
    cardcount++
    return p
}
function setupdefaults() {
    document.getElementById("technicalbackground").append(logocard())
    carddefaults.forEach((e)=>{
        document.getElementById("technicalbackground").append(cardgenerator(e[0],e[1],e[2],e[3],e[4],e[5]))
    })
    actioncards.forEach((e)=>{
        document.getElementById("technicalbackground").append(actioncardgen(e[0],e[1],e[2],e[3]))
    })
}
function showoffdamage(damage) {
    a = document.createElement("p")
    a.textContent = damage
    if (damage < 0) a.style.color = "red";
    else if (damage > 0) a.style.color = "green";
    a.className = "DamageIndicator"
    setTimeout(()=>{
        a.remove()
    },5100)
    return a;
}
enter = "\n"
HowToPlay = `
Welcome, this is a card game if you didnt already know!
well as you see there are 2 sides in the screen which are split by a line
Left side is for player 1 and Right side for player 2 and who starts is random!
there is a card in top center with crossed swords thats the main card each round you can click that card 3 times and it will give both players a random card.
You can also not click it(the total cards in the game is 100 and it wont change!) like if you dont want extra cards for now and are happy about them
there are 2 types of card: Action cards, Weapon cards.
Weapon cards are used in mainhand/offhand to deal damage or absorb(shield) and Action cards are used in action part to do the thing which is written inside them
Weapon cards have health & attack & use count
Health is the amount of damage your weapon can absorb from the enemy (Breaks if its 0)
Use count is how many times you can use your weapon to deal damage (Breaks if its 0)
Attack is how much damage you can deal to the enemy.
The button you see in the center is the round(turn) button, if you have arranged your cards then click on it and then it will switch turns and its time your enemy arranges their cards
if both players have arranged their cards and have clicked the button then the battle begins!
mainhand only deals damage to mainhand of the enemy and so for offhand unless the weapon on that slot breaks! then the rest of the damage will be dealt to the other slot and if that also breaks(or is already broken) the rest will be dealt to you!, if your health reaches 0 you will lose the game, I guess thats all.
Good luck!!!`.replace("\n","")
About = `
This is a Dynamic Card Game made by Jefferson!
Special Thanks to Navid Abd, Random1785 for their epic ideas!
(though I wasnt good enough to make them as well as they said)
Its hosted on a public github repository and is open source
Jefferson's Discord: mr.jeferson
More by Jefferson: https://mcdev.studio & https://amirhossainj123.github.io`.replace("\n","")
function opensettings() {
    let c = prompt(`In other to change something do like "Brightness 10"\nBrightness: ${SETTINGS_Brightness}\nScale: ${SETTINGS_Scale}\nContrast: ${SETTINGS_Contrast}\nWidth: ${SETTINGS_Width} pixels\nHeight: ${SETTINGS_Height} pixels`)
    if (c == null) {infobutton()}
    else {
        c = c.replaceAll("pixels","").replaceAll("pixel","").replaceAll("px","")
        if (c.toLowerCase().startsWith("brightness")) {localStorage.setItem("SET_Brightness",parseFloat(c.toLowerCase().replace("brightness ","")))}
        else if (c.toLowerCase().startsWith("contrast")) {localStorage.setItem("SET_Contrast",parseFloat(c.toLowerCase().replace("contrast ","")))}
        else if (c.toLowerCase().startsWith("scale")) {localStorage.setItem("SET_Scale",parseFloat(c.toLowerCase().replace("scale ","")))}
        else if (c.toLowerCase().startsWith("width")) {localStorage.setItem("SET_Width",parseFloat(c.toLowerCase().replace("width ","")))}
        else if (c.toLowerCase().startsWith("height")) {localStorage.setItem("SET_Height",parseFloat(c.toLowerCase().replace("height ","")))}
        else {alert("umm you put wrong input be careful ig"); opensettings()}
        document.getElementById("technicalbackground").style.transform = `scale(${SETTINGS_Scale})`
        document.getElementById("technicalbackground").style.filter = `brightness(${SETTINGS_Brightness}) contrast(${SETTINGS_Contrast})` 
        document.getElementById("technicalbackground").style.width = `${SETTINGS_Width}px` 
        document.getElementById("technicalbackground").style.height = `${SETTINGS_Height}px` 
    }
}
function infobutton() {
    let a = prompt(`A menu which I dont know what to name it!${enter}1. How to play${enter}2. Settings${enter}3. About`)
    if (a != null)
    switch (a.toLowerCase().replaceAll(" ","")) {
        case "1": case "howtoplay":
            HowToPlay.split(`.${enter}`).forEach((e)=>{
                alert(e)
            })
            break;
        case "2": case "settings":
            opensettings()
            break;
        case "3": case "about":
            alert(About)
            break;
        case "aprilfools":
            document.getElementById("leftcards").append(cardgenerator("legendary","https://cdn3.emoji.gg/emojis/5746-happy.png","April Fools",999,999,999))
            document.getElementById("rightcards").append(cardgenerator("legendary","https://cdn3.emoji.gg/emojis/5746-happy.png","April Fools",999,999,999))
            break;
        default:
            alert("You gotta enter either 1 or 2 or 3 or 'How to play' or 'Settings' or 'About'")
            infobutton()
            break;
    }
}