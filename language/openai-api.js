export default class ChatSession
{

  addMessage(role, content) {
    this.messages.push({ role, content });
  }

  getMessages() {
    return this.messages;
  }

  getFormattedMessages() {
    const messages = this.messages;

    var using_messages = [];

    for (var i = 0; i < messages.length; i++) {
      if (messages[i]["role"] != 'system') {
        using_messages += messages[i];
      }
    }

    var html = '';

    for (var i = 0; i < using_messages.length; i++) {
      html += '<span class="role-' + using_messages[i]["role"] + '">' + using_messages[i]["role"] + '</span>';
      html += '<span class="content-' + using_messages[i]["role"] + '">' + using_messages[i]["content"] + '</span>';
    }

    return html;
  }

  constructor(activity) {
    this.activity = activity;
    this.messages = [];

    const request = new Request('./prompts.json');
    fetch(request)
      .then(response => response.json())
      .then(data => {
        this.prompts = data;
      }).then(() => {
        this.messages = [
          {
            role: 'system',
            content: this.prompts[activity]["prompt"]
          }
        ];
      });
  }

  async sendMessage(content) {
    this.addMessage('user', content);
    await this.getResponse();
  }

  async getResponse() {
    while (this.messages.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const request = new Request('./request.php', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: this.messages
      })
    });

    const response = await fetch(request);
    const data = await response.text();
    const json = JSON.parse(data);
    console.log(json);
    console.log(json["choices"][0]["message"]["content"]);

    console.log(this.messages);

    this.addMessage('assistant', json["choices"][0]["message"]["content"]);
  }

}