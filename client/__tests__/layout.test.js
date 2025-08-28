const {renderDOM} = require('./helpers')

describe('index.html', () => {
  let dom
  let document

  // Runs before each test
  beforeEach(async () => {
    dom = await renderDOM('./client/index.html')
    document = dom.window.document
  })

  it("h1 is presented", () => {
    const h1 = document.querySelector('h1')
    expect(h1).toBeTruthy()
    expect(h1.textContent).toBe('Quizard')
    })

  it("h1 has a link with the right href", () => {
    const link = document.querySelector('h1 a')
    expect(link).toBeTruthy()
    expect(link.innerHTML).toBe('Quizard')
    expect(link.getAttribute('href')).toBe('index.html')
}); 

    it('login form is presented', () => {
    const form = document.getElementById('login-form')
    expect(form).toBeTruthy()
  })

  it('email input exists with placeholder', () => {
    const email = document.getElementById('email')
    expect(email).toBeTruthy()
    expect(email.placeholder).toBe('Enter your email')
  })

    it('password input exists with placeholder', () => {
        const password = document.getElementById('password')
        expect(password).toBeTruthy()
        expect(password.placeholder).toBe('Enter your password')
    })

    it('submit button exists with text', () => {
        const submitBtn = document.querySelector("button[type='submit']")
        expect(submitBtn).toBeTruthy()
        expect(submitBtn.textContent).toBe('Login')
    })
})

