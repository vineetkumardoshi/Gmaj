function submit() {
    var flag = 0;
    var maxlines = "-1";
    if(document.getElementById('check1').checked){
            if(blocklist.length <= 0){
                $('#dialog-form').dialog();
                console.log('here');
                return;
            }    
    } else {
        flag += 1;
    }
    if(document.getElementById('check2').checked){
        if( document.getElementById('max-lines').value.length === 0 || (Number(document.getElementById('max-lines').value) <= 0) === true) {
            
            $("#dialog-form").dialog();
            
            return;
        } else {
            console.log(document.getElementById('max-lines').value);
            maxlines = document.getElementById('max-lines').value;
        }
    }  else {
        flag += 1
    }  
    if(flag === 2){
        $('#code').html("");
    } else {
        console.log('Accepted');
        
        var myString = `
import json
from sys import stdin


def check_inputs (inputs, outputs, signals ):
    scores = []
    valid = []
    total_count = 0.0
    total_correct = 0.0
    iter_signal = 0
    for inps, outps in zip(inputs, outputs):
        inps = inps.strip()
        outps = outps.strip()
 
        count = len(inps.strip().split())
        correct = -count*1.0
 
        total_count += count
 
        if signals[iter_signal] != 0 or len(inps.split()) != len(outps.split()):
            scores.append(0)
            valid.append(0)\n
        else:
            for inp, outp in zip(inps.split(), outps.split()):
                if inp == outp:
                    correct+=2
 
            total_correct += correct
            correct /= count
            if correct > 0:
                valid.append(1)
            else:
                valid.append(0)
 
            iter_signal += 1
 
    return valid, total_correct/total_count
 
def process(data):
    valid, score = check_inputs(data["expected_outputs"], data["outputs"], data["signals"])
    if score <= 0:
        score = 0
    return score, valid
 
if __name__ ==  '__main__':
    stdin = stdin.read().split('\\n')
 
    run_directory = stdin[1]
 
    request = json.load(open(run_directory + "request.json"))
 
 
    data = {
        # The submitted source code
        "source": request["source"],
 
        "testcases": request["testcase_sources"],
 
        "lang": request["lang"],
 
        "expected_outputs": request["expected_outputs"],
 
        "outputs": [],
 
        "signals":[]
    }
 
    data["signals"] = map( int, open( "signal00.sig" ).read().strip().split() )
    for index in range(len(request["testcase_sources"])):
        output = open(run_directory + "output%05d.out" %(index)).read()
        data["outputs"].append(output)
 

    
    score, testcase_status = process(data)                  
`;
        if(blocklist.length > 0){
            var list = JSON.stringify(blocklist);
            blocklist_string = `
    for word in ${list}:
        flag1 = 0
        for line in data["source"].split('\\n'):
            if word in line:
                score = 0
                testcase_status = [0]*len(testcase_status)
                flag1 = 1
                break
        if flag1 == 1:
            break`
            myString = myString+blocklist_string;
        }
        if(document.getElementById('check2').checked && no === 1){
            var lines = `

    if len(data["source"].split('\\n')) > int(${maxlines}):
        score = 0
        testcase_status = [0]*len(testcase_status)`;
            myString = myString+lines;
        }
        if(document.getElementById('check2').checked && yes === 1){
            var lines = `
    count = 0
    for i in data["source"].split('\\n'):
        if set(i) == set([' ']) or set(i) == set(""):
            count += 1
    if len(data["source"].split('\\n')) > int(${maxlines}) + count:
        score = 0
        testcase_status = [0]*len(testcase_status)`;
            myString = myString+lines;
        }
      myString = myString + `
    
    if score < 1:
        score = 0
        testcase_status = [0]*len(testcase_status)
          
    print score
    print " ".join(str(i) for i in testcase_status)`;    
        $('#code').html('<pre id="pre" style="display:none;">'+myString+'</pre>');
        $('#pre').show(1000);
    }
}