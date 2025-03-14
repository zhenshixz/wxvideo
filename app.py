from flask import Flask, request, jsonify, render_template
from http import HTTPStatus
from dashscope import VideoSynthesis

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_video():
    data = request.json
    prompt = data.get('prompt')
    api_key = data.get('api_key', 'sk-7c3ad80f4f47499abeaaf2ff81c51c54')

    if not prompt:
        return jsonify({'error': '缺少提示词参数'}), 400

    try:
        rsp = VideoSynthesis.call(
            api_key=api_key,
            model='wanx2.1-t2v-turbo',
            prompt=prompt,
            size='1280*720'
        )

        if rsp.status_code == HTTPStatus.OK:
            return jsonify({
                'success': True,
                'video_url': rsp.output.video_url
            })
        else:
            return jsonify({
                'error': f'生成失败: {rsp.message}',
                'status_code': rsp.status_code,
                'code': rsp.code
            }), rsp.status_code

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)