export default class ChatSession
{

  addMessage(role, content) {
    this.messages.push({ role, content });
  }

  getMessages() {
    return this.messages;
  }

  getFormattedMessages() {
    var html = '';

    for (var i = 0; i < this.messages.length; i++) {
      if (this.messages[i]["role"] === 'system') {
        continue;
      }
      html += '<span class="role-' + this.messages[i]["role"] + '">' + this.messages[i]["role"] + '</span>';
      html += '<span class="content-' + this.messages[i]["role"] + '">' + this.messages[i]["content"] + '</span>';
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