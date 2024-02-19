console.log("Hello");

// Global List of Restriction Enzymes

//Overhangs are not considered yet
// site: String or RegEx
// cut: Replacement String
const restrictionEnzymes = [
  {name:"EcoRI",   site: "GAATTC",     cut: "GAA|TTC", offset: 2},
  {name:"EcoRV",   site: "GATATC",     cut: "GAT|ATC", offset: 0},
  {name:"HindIII", site: "AAGCTT",     cut: "AAG|CTT", offset: 3},
  {name:"KpnI",    site: "GGTACC",     cut: "GGT|ACC", offset: 2},
  {name:"BamHI",   site: "GGATCC",     cut: "GGA|TCC", offset: 2},
]

/*
EcoRI
G|AATT C
C TTAA|G

A, B, C, D, E
4! = 4*3*2 = 24
A
B
C
D
E
AB
AC
AD
AE
BC
BD
BE
CD
CE
DE
ABC
ABD
ABE
BCD
BCE
BDE
CDE

1,1,1




*/
//  {name:"SacI", site: "AAGCTT",     cut: "AAG|CTT", offset: 3},
//  {name:"SalI", site: "AAGCTT",     cut: "AAG|CTT", offset: 3},

// {name:"EcoRII",  site: /CC(A|T)GG/g, cut: "CC$1|GG", offset: 3},          // CCWGG W = A or T)
// {name:"TaqI",    site: "TCGA",       cut: "TC|GA"  , offset: 2},



// Sequence
var sequence = lambda.sequence
//sequence = "123GAATTC"



console.time("timer")


// Reduce to only Cutting Enzymes

const getCutSites = function(seq, enzymes) {
  var cuttingEnzymes = []
  enzymes.forEach(function(enzyme) {
    // get all matches
    var cutSites = [...seq.matchAll(enzyme.site)].map(e => e.index + enzyme.offset) // map 
    // e.index -> cut positions, offset for enzyme seq
    if (cutSites.length > 0) {
      cuttingEnzymes.push({enzyme:enzyme, cutSites:cutSites})
    } 
  })
  return cuttingEnzymes
}



// construct PowerSet of Cutting Enzymes
const constructPowerSet = function(cuttingEnzymes) {
  var i, j, powerSet = []
  for (i=0; i<2**cuttingEnzymes.length; i++) {

    const bitString = i.toString(2).padStart(cuttingEnzymes.length, "0")
    // created binary numbers of re "01011", ...
    var subSet = []
    for (j=0; j<bitString.length; j++) {            // loop over binary number
      if (bitString[j] === '1') {                   // or (bitString >> j) & 1)
        subSet.push(cuttingEnzymes[j])                  // add cutting enzyme
      }
    }
    powerSet.push(subSet)
  }
  powerSet.sort((a,b) => a.length - b.length)       // sort array by length in place
  return powerSet
}


const getCuts = function(sequence, powerSet) {
  usedSets = []
  
  powerSet.forEach(function(s) {
    
    var enyzmes = []
    var cutSites = []
    s.forEach(function(t) {
      enyzmes.push(t.enzyme.name)
      cutSites.push(...t.cutSites)
    })
    
    
    //cutSites.push(0) 
    cutSites.push(sequence.length)
    cutSites.sort((a,b)=>a-b)
    
    fragments = cutSites.map((pos,i,a) => pos - (a[i-1] || 0) )
    fragments.sort((a,b)=>a-b)
    
    fragments = [...new Set(fragments)] // remove duplicates, maybe duplicates have stronger signal?
    usedSets.push({enyzmes, fragments, cutSites})
  })
  
  console.log(usedSets);
  
}


var cuttingEnzymes = getCutSites(sequence, restrictionEnzymes)
console.log("cuttingEnzymes", cuttingEnzymes);
var enzymePowerSet = constructPowerSet(cuttingEnzymes)
console.log("enzymePowerSet", enzymePowerSet)
var allCutSites = getCuts(sequence, enzymePowerSet)



console.timeEnd("timer")


