let isGenerating = false;

const loading = document.getElementById('loading');
loading.style.display = 'none';

async function generateVideo() {
    const prompt = document.getElementById('prompt').value.trim();
    if (!prompt) {
        showError('请输入提示词');
        return;
    }

    const generateBtn = document.getElementById('generateBtn');
    const stopBtn = document.getElementById('stopBtn');
    const error = document.getElementById('error');
    const videoContainer = document.getElementById('videoContainer');
    const videoPlayer = document.getElementById('videoPlayer');

    generateBtn.disabled = true;
    stopBtn.disabled = false;
    loading.style.display = 'block';
    error.style.display = 'none';
    videoContainer.style.display = 'none';
    isGenerating = true;

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt,
                duration: 5,  // 默认5秒
                resolution: '720p'  // 默认720p
            })
        });

        const data = await response.json();

        if (!isGenerating) {
            return;
        }

        if (data.success) {
            videoPlayer.src = data.video_url;
            videoContainer.style.display = 'block';
        } else {
            showError(data.error || '生成失败');
        }
    } catch (err) {
        showError('请求失败：' + err.message);
    } finally {
        generateBtn.disabled = false;
        stopBtn.disabled = true;
        loading.style.display = 'none';
        isGenerating = false;
    }
}

function stopGeneration() {
    isGenerating = false;
    document.getElementById('generateBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
    loading.style.display = 'none';
}

function showError(message) {
    const error = document.getElementById('error');
    error.textContent = message;
    error.style.display = 'block';
}