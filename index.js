// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const coin = ()=>{
    return Math.random() < 0.5;
};
const __int = (low, high)=>{
    const min = Math.ceil(low);
    const max = Math.floor(high);
    return Math.floor(Math.random() * (max - min + 1) + min);
};
const rgb = (low = 0, high = 255)=>{
    const r = __int(low, high);
    const g = __int(low, high);
    const b = __int(low, high);
    return {
        r,
        g,
        b
    };
};
const color = (low = 0, high = 255)=>{
    const { r , g , b  } = rgb(low, high);
    return `rgb(${r}, ${g}, ${b})`;
};
const element = (array)=>{
    const high = array.length - 1;
    const index = __int(0, high);
    return array[index];
};
const __default = {
    coin,
    int: __int,
    rgb,
    color,
    element
};
const filter = (p)=>{
    const { current , previous , word  } = p;
    return current.filter((subword)=>{
        if (word.includes(subword)) {
            return false;
        }
        for (const child of previous){
            if (child.includes(subword)) {
                return false;
            }
        }
        return true;
    });
};
const getChildren = (p)=>{
    const { attempts , count , filter , random , search , subtract , tries  } = p;
    const children = [];
    let { word  } = p;
    const starter = word;
    let attempt = 0;
    attemptLoop: while(attempt < attempts){
        let matched = 0;
        word = starter;
        children.length = 0;
        childLoop: while(matched < count){
            const trie = tries[matched];
            const letters = word.split("");
            const subwords = search({
                node: trie,
                letters
            });
            let filteredSubwords = filter({
                current: subwords,
                previous: children,
                word: starter
            });
            if (filteredSubwords.length === 0) {
                break childLoop;
            }
            filteredSubwords.sort((w1, w2)=>{
                return w1.length < w2.length ? 1 : -1;
            });
            if (matched === count - 1) {
                const { length  } = filteredSubwords[0];
                filteredSubwords = filteredSubwords.filter((subword)=>{
                    return subword.length === length;
                });
            }
            const { length: length1  } = filteredSubwords;
            const index = random.coin() ? random.int(0, Math.floor(length1 / 2)) : random.int(0, length1 - 1);
            const subword = filteredSubwords[index];
            children.unshift(subword);
            word = subtract({
                word: subword,
                from: word
            });
            matched += 1;
        }
        attempt += 1;
        if (children.length === count) {
            break attemptLoop;
        }
    }
    return children;
};
const getColor = (p)=>{
    const { random , maxColorRetryCount , minColor , maxColor , minRGBDelta  } = p;
    for(let i = 0; i < maxColorRetryCount; i += 1){
        const { r , g , b  } = random.rgb(minColor, maxColor);
        if (Math.abs(r - g) < minRGBDelta || Math.abs(r - b) < minRGBDelta || Math.abs(g - b) < minRGBDelta) {
            continue;
        }
        return `rgb(${r}, ${g}, ${b})`;
    }
    return random.color(minColor, maxColor);
};
const getText = (p)=>{
    const { attempts , filter , getChildren , random , search , subtract , tries , words ,  } = p;
    const count = random.element([
        1,
        2,
        2,
        2
    ]);
    const orderedTries = [
        tries.noun
    ];
    if (count === 1) {
        orderedTries[0] = random.element(Object.values(tries));
    } else {
        orderedTries.push(tries.all);
    }
    while(true){
        const { length  } = words;
        if (length === 0) {
            throw Error("No words to choose from");
        }
        const index = random.coin() ? random.int(0, Math.floor(length / 7)) : random.int(0, length - 1);
        const [word] = words.splice(index, 1);
        const children = getChildren({
            attempts,
            count,
            filter,
            random,
            search,
            subtract,
            tries: orderedTries,
            word
        });
        if (children.length > 0) {
            return {
                word,
                children
            };
        }
    }
};
const wordRegex = /\w/;
const search = (p)=>{
    const { isWordEnd , children  } = p.node;
    const { letters  } = p;
    const results = [];
    if (isWordEnd) {
        results.push("");
    }
    for (const [key, child] of Object.entries(children)){
        if (wordRegex.test(key)) {
            const i = letters.indexOf(key);
            if (i !== -1) {
                const others = letters.slice(0, i).concat(letters.slice(i + 1));
                const subresults = search({
                    node: child,
                    letters: others
                });
                for (const subresult of subresults){
                    const result = `${key}${subresult}`;
                    results.push(result);
                }
            }
        } else {
            const subresults1 = search({
                node: child,
                letters
            });
            for (const subresult1 of subresults1){
                const result1 = `${key}${subresult1}`;
                results.push(result1);
            }
        }
    }
    return results;
};
const subtract = (p)=>{
    const { word , from  } = p;
    const letters = from.split("");
    const lettersToRemove = word.split("");
    outer: for (const letter of lettersToRemove){
        for(let i = 0; i < letters.length; i += 1){
            if (letters[i] === letter) {
                letters.splice(i, 1);
                continue outer;
            }
        }
        throw Error(`Letter "${letter}" not found in word "${from}"`);
    }
    return letters.join("");
};
const trieify = (words)=>{
    const trie = {
        letter: "",
        isWordEnd: false,
        children: {}
    };
    for (const word of words){
        const finalIndex = word.length - 1;
        let pointer = trie;
        for (const [i, letter] of Object.entries(word)){
            const { children  } = pointer;
            pointer = children[letter];
            if (pointer === undefined) {
                const isWordEnd = Number(i) === finalIndex;
                pointer = {
                    letter,
                    isWordEnd,
                    children: {}
                };
                children[letter] = pointer;
            }
        }
    }
    return trie;
};
const adjectivesURL = "data/adjectives.txt";
const nounsPluralURL = "data/nouns_plural.txt";
const nounsSingularURL = "data/nouns_singular.txt";
const verbsURL = "data/verbs.txt";
const minStarterLength = 0;
const maxChildrenRetryCount = 10;
const select = (s)=>document.querySelector(s);
const ui = {
    root: select(":root"),
    main: select("#main"),
    word: select("#word"),
    children: select("#children"),
    leftArrow: select("#left-arrow"),
    rightArrow: select("#right-arrow"),
    about: select("#about"),
    aboutClose: select("#about > .content > .close")
};
let starters = [];
const unchosenStarters = [];
let adjectiveTrie;
let nounTrie;
let verbTrie;
let allTrie;
const load = async ()=>{
    const urls = [
        adjectivesURL,
        nounsPluralURL,
        nounsSingularURL,
        verbsURL
    ];
    const promises = urls.map((url)=>fetch(url).then((response)=>response.text()).then((text)=>text.trim().split("\n")));
    const [adjectives, nounsPlural, nounsSingular, verbs] = await Promise.all(promises);
    const words = [
        ...adjectives,
        ...nounsPlural,
        ...nounsSingular,
        ...verbs
    ];
    words.sort((word1, word2)=>word2.length - word1.length);
    starters = words.filter((starter)=>{
        return starter.length >= minStarterLength;
    });
    adjectiveTrie = trieify(adjectives);
    nounTrie = trieify([
        ...nounsPlural,
        ...nounsSingular
    ]);
    verbTrie = trieify(verbs);
    allTrie = trieify([
        ...adjectives,
        ...nounsSingular,
        ...verbs
    ]);
};
const newColor = ()=>{
    return getColor({
        random: __default,
        maxColorRetryCount: 10,
        minColor: 130,
        maxColor: 180,
        minRGBDelta: 15
    });
};
const startColor = newColor();
const history = {
    index: 0,
    stack: [
        {
            word: "wonderful",
            children: [
                "word",
                "fun"
            ],
            color: startColor
        }
    ]
};
const show = (index)=>{
    const content = history.stack[index];
    ui.word.textContent = content.word;
    ui.children.textContent = content.children.join(" ");
    ui.root.style.setProperty("--parameter-color", content.color);
    history.index = index;
};
const back = ()=>{
    const { index  } = history;
    if (index === 0) {
        ui.main.classList.add("hidden");
        ui.about.classList.remove("hidden");
    } else {
        show(index - 1);
    }
};
const forward = ()=>{
    const { index , stack  } = history;
    if (index === stack.length - 1) {
        if (starters.length === 0) {
            return;
        }
        if (unchosenStarters.length === 0) {
            unchosenStarters.push(...starters);
        }
        const color = newColor();
        let text = {
            word: "uh oh! something went wrong",
            children: [
                "please reload the page"
            ]
        };
        try {
            text = getText({
                attempts: maxChildrenRetryCount,
                filter,
                getChildren,
                random: __default,
                search,
                subtract,
                tries: {
                    adjective: adjectiveTrie,
                    noun: nounTrie,
                    verb: verbTrie,
                    all: allTrie
                },
                words: unchosenStarters
            });
        } catch (error) {
            ui.leftArrow.classList.add("hidden");
            ui.rightArrow.classList.add("hidden");
            console.error(error);
        }
        history.stack.push({
            color,
            ...text
        });
    }
    show(index + 1);
};
const pressed = (element)=>{
    element.classList.add("pressed");
};
const unpressed = (element)=>{
    element.classList.remove("pressed");
};
const leftDown = ()=>pressed(ui.leftArrow);
const leftUp = ()=>{
    unpressed(ui.leftArrow);
    back();
};
const rightDown = ()=>pressed(ui.rightArrow);
const rightUp = ()=>{
    unpressed(ui.rightArrow);
    forward();
};
const main = async ()=>{
    ui.root.style.setProperty("--parameter-color", startColor);
    ui.aboutClose.onpointerup = ()=>{
        ui.about.classList.add("hidden");
        ui.main.classList.remove("hidden");
    };
    ui.leftArrow.onpointerdown = leftDown;
    ui.leftArrow.onpointerup = leftUp;
    await load();
    ui.rightArrow.classList.remove("disabled");
    ui.rightArrow.onpointerdown = rightDown;
    ui.rightArrow.onpointerup = rightUp;
};
main();
