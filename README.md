
# @crashbytes/contentful-slideout

## 🧩 Overview

`@crashbytes/contentful-slideout` is a **react-based slideout panel system** designed to simplify the development of contextual editing panels inside **Contentful apps** and general **React applications**.

It provides a **flexible, reusable, and accessible slideout component** that allows content editors and developers to interact with additional content without losing their current workspace focus.

---

## 🚨 Problem Statement

In Contentful and other CMS-based applications, developers often need to:
- Open **contextual side panels** to edit or view related content.
- Enable **multi-entity workflows** without forcing a user to navigate away.
- Provide a **seamless editing experience** while preserving context.

**Challenge:**  
Building this behavior from scratch is time-consuming and error-prone. Handling state management, animations, overlay logic, and Contentful SDK integration takes significant effort.

**Solution:**  
`@crashbytes/contentful-slideout` solves this by providing:
- **Pre-built slideout components with sensible defaults.**
- **Storybook-powered interactive demos and tests.**
- **Contentful-centric UI patterns that match editor workflows.**

---

## 🚀 Installation

```bash
yarn add @crashbytes/contentful-slideout
```

or

```bash
npm install @crashbytes/contentful-slideout
```

---

## ⚙️ Usage

### Basic Slideout

```tsx
import { Slideout, useSlideout } from '@crashbytes/contentful-slideout';

const Demo = () => {
  const { isOpen, open, close } = useSlideout();

  return (
    <>
      <button onClick={open}>Open Panel</button>
      <Slideout isOpen={isOpen} onClose={close} title="Edit Details">
        <p>Edit your content here.</p>
      </Slideout>
    </>
  );
};
```

---

### Contentful Integration Example

```tsx
import { Slideout, useSlideout } from '@crashbytes/contentful-slideout';
import { useSDK } from '@contentful/react-apps-toolkit';

const ContentfulExample = () => {
  const sdk = useSDK();
  const { isOpen, open, close } = useSlideout();

  return (
    <>
      <sdk.ui.Button onClick={open}>Edit Entry</sdk.ui.Button>

      <Slideout isOpen={isOpen} onClose={close} title="Edit Entry">
        <p>Use Contentful fields here with SDK integration.</p>
      </Slideout>
    </>
  );
};
```

---

## 🧰 Props & API

| Prop        | Type                | Required | Description                               |
|-------------|---------------------|----------|-------------------------------------------|
| `isOpen`    | `boolean`            | ✅       | Controls open/close state                 |
| `onClose`   | `() => void`         | ✅       | Function called when slideout closes      |
| `title`     | `string`             | ✅       | Slideout header title                     |
| `children`  | `React.ReactNode`    | ✅       | Slideout content                          |
| `width`     | `string` (optional)  | ❌       | Custom width (`default: 400px`)           |

---

## 🎛️ Storybook Interactive Demos

Run Storybook to visualize all slideout states:

```bash
yarn storybook
```

Open in your browser:

```
http://localhost:6006
```

---

## 📸 Storybook Screenshots

### Interactive Demo

![Interactive Demo](./assets/screenshot-interactive-demo.png)

---

### Superhero Edit Example

![Superhero Slideout](./assets/screenshot-superhero.png)

---

### Pizza Menu Item

![Pizza Slideout](./assets/screenshot-pizza.png)

---

### Read-Only Mode

![Read-Only Slideout](./assets/screenshot-readonly.png)

---

## 📂 Folder Structure

```
@crashbytes/contentful-slideout
│
├─ src/
│   ├─ components/Slideout.tsx
│   ├─ hooks/useSlideout.ts
│   └─ types/index.ts
│
├─ .storybook/
├─ stories/
│   ├─ Superhero.stories.tsx
│   ├─ Pizza.stories.tsx
│   └─ Interactive.stories.tsx
│
├─ README.md
└─ package.json
```

---

## 🛠️ Development & Contribution

1. Clone the repo:

```bash
git clone https://github.com/CrashBytes/contentful-slideout.git
cd contentful-slideout
```

2. Install dependencies:

```bash
yarn install
```

3. Run Storybook:

```bash
yarn storybook
```

4. Create feature branches and submit PRs.

---

## 🔑 License

MIT © CrashBytes

---

## 👨‍💻 Maintainer

**CrashBytes Team**  
GitHub: [CrashBytes](https://github.com/CrashBytes)
