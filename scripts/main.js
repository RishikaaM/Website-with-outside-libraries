let model;

const onNextClick = () => {


}

const showLoader = (loadingContainer) => {
    loadingContainer.classList.add("show-loader");
}

const hideLoader = (loadingContainer) => {
    loadingContainer.classList.remove("show-loader");
}

const setProgress = (name, progressbar, value) => {
    const backgroundColor = getComputedStyle(progressbar).backgroundColor;
    console.log(`backgroundColor: ${backgroundColor}`);

    switch (name) {
        case "neutral":
            progressbar.style = `background-color: ${value !== 0 ? "#CCCCCC" : "none"};width: ${value}%;`;
            break;
        case "happy":
            progressbar.style = `background-color: ${value !== 0 ? "#FFD700" : "none"};width: ${value}%;`;
            break;
        case "sad":
            progressbar.style = `background-color: ${value !== 0 ? "#6495ED" : "none"};width: ${value}%;`;
            break;
        case "angry":
            progressbar.style = `background-color: ${value !== 0 ? "#FF6347" : "none"};width: ${value}%;`;
            break;
        case "fearful":
            progressbar.style = `background-color: ${value !== 0 ? "#8B4513" : "none"};width: ${value}%;`;
            break;
        case "disgusted":
            progressbar.style = `background-color: ${value !== 0 ? "#556B2F" : "none"};width: ${value}%;`;
            break;
        case "surprised":
            progressbar.style = `background-color: ${value !== 0 ? "#FFA500" : "none"};width: ${value}%;`;
            break;
    }

    progressbar.innerText = `${value}%`;
}

const changeBackgroundBasedOnExpression = (element, expression) => {
    element.setAttribute("src", `images/backgrounds/${expression}.jpg`);
}

const onDetectExpressionsClick = async () => {

    const bgImage = document.getElementById("background-image");
    const video = document.getElementById("cam-video");
    const canvas = document.querySelector("#captured-image");
    const image = document.querySelector("#image");
    const loaderContainer = document.getElementById("loader-container");
    const resultsContainer = document.getElementById("results");
    const neutralProgress = document.getElementById("neutral-progress");
    const happyProgress = document.getElementById("happy-progress");
    const sadProgress = document.getElementById("sad-progress");
    const angryProgress = document.getElementById("angry-progress");
    const fearfulProgress = document.getElementById("fearful-progress");
    const disgustedProgress = document.getElementById("disgusted-progress");
    const surprisedProgress = document.getElementById("surprised-progress");

    // Show Loader

    showLoader(loaderContainer);

    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    let imageDataUrl = canvas.toDataURL('image/jpeg');

    image.setAttribute("src", imageDataUrl);


    const detectionsWithLandmarksAndExpressions = await faceapi
        .detectAllFaces(image)
        .withFaceLandmarks()
        .withFaceExpressions()

    console.log(`${JSON.stringify(detectionsWithLandmarksAndExpressions?.[0]["expressions"])}`);

    const expressions = detectionsWithLandmarksAndExpressions?.[0]?.["expressions"];

    const neutral = String(expressions["neutral"]);
    const happy = String(expressions["happy"]);
    const sad = String(expressions["sad"]);
    const angry = String(expressions["angry"]);
    const fearful = String(expressions["fearful"]);
    const disgusted = String(expressions["disgusted"]);
    const surprised = String(expressions["surprised"]);


    const neutralInt = parseInt((Number(neutral) * 100).toString());
    const happyInt = parseInt((Number(happy) * 100).toString());
    const sadInt = parseInt((Number(sad) * 100).toString());
    const angryInt = parseInt((Number(angry) * 100).toString());
    const fearfulInt = parseInt((Number(fearful) * 100).toString());
    const disgustedInt = parseInt((Number(disgusted) * 100).toString());
    const surprisedInt = parseInt((Number(surprised) * 100).toString());

    const expressionsArray = [
        { name: "neutral", value: neutralInt },
        { name: "happy", value: happyInt },
        { name: "sad", value: sadInt },
        { name: "angry", value: angryInt },
        { name: "fearful", value: fearfulInt },
        { name: "disgusted", value: disgustedInt },
        { name: "surprised", value: surprisedInt },
    ];

    expressionsArray.sort((a, b) => {
        return b.value - a.value;
    })

    console.log(`neutral: ${neutralInt}%`);
    console.log(`happy: ${happyInt}%`);
    console.log(`sad: ${sadInt}%`);
    console.log(`angry: ${angryInt}%`);
    console.log(`fearful: ${fearfulInt}%`);
    console.log(`disgusted: ${disgustedInt}%`);
    console.log(`surprised: ${surprisedInt}%`);

    // Setup results on progress bars
    setProgress("neutral", neutralProgress, neutralInt);
    setProgress("happy", happyProgress, happyInt);
    setProgress("sad", sadProgress, sadInt);
    setProgress("angry", angryProgress, angryInt);
    setProgress("fearful", fearfulProgress, fearfulInt);
    setProgress("disgusted", disgustedProgress, disgustedInt);
    setProgress("surprised", surprisedProgress, surprisedInt);

    // Show results div
    resultsContainer.hidden = false;

    // Change background
    changeBackgroundBasedOnExpression(bgImage, expressionsArray[0]?.name);

    // Hide loader
    hideLoader(loaderContainer);

}

// JavaScript logic to handle element selection
document.addEventListener('DOMContentLoaded', async function () {

    const video = document.getElementById('cam-video');

    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video.srcObject = stream;

    // Load Models
    await faceapi.loadSsdMobilenetv1Model('models')
    // accordingly for the other models:
    // await faceapi.loadTinyFaceDetectorModel('models')
    // await faceapi.loadMtcnnModel('models')
    await faceapi.loadFaceLandmarkModel('models')
    // await faceapi.loadFaceLandmarkTinyModel('models')
    // await faceapi.loadFaceRecognitionModel('models')
    await faceapi.loadFaceExpressionModel('models')

});
