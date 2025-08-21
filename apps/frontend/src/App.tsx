// updated nav section with visible text colors
<nav className="flex space-x-6">
  {['Inbox','Tasks','Projects','Calendar'].map((item) => (
    <button
      key={item}
      onClick={() => setActive(item)}
      className={`pb-2 text-white hover:text-light-purple ${
        active === item ? 'border-b-2 border-white' : ''
      }`}
    >
      {item}
    </button>
  ))}
</nav>