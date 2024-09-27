import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dictionary from '../Dictionary'; // Adjust the path as necessary

describe("Dictionary Component", () => {
  it("mock api and display data", async () => {
    render(<Dictionary />);  

    // Get the input element (textbox) using its accessible name
    const inputElement = screen.getByRole("textbox", { name: /search word/i });
    expect(inputElement).toBeInTheDocument();  // This should now work

    // Type 'hello' into the input
    await userEvent.type(inputElement, "hello");
    expect(inputElement).toHaveValue("hello");

    // Get the search button and click it
    const buttonElement = screen.getByRole("button", { name: /search/i });
    await userEvent.click(buttonElement);

    // Simulate a noun definition showing up and wait for it
    await waitFor(() => {
      expect(screen.getByText(/interjection/i)).toBeInTheDocument();
    });
  });

  it("displays an error if the search field is empty", async () => {
    render(<Dictionary />);

    // Get the input element (textbox)
    const inputElement = screen.getByRole("textbox", { name: /search word/i });

    // Attempt to click the search button without entering a word
    const buttonElement = screen.getByRole("button", { name: /search/i });
    await userEvent.click(buttonElement);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/please enter a word to search/i)).toBeInTheDocument(); // Adjust if your error message text is different
    });
  });

  it("displays an error message for a non-existent word", async () => {
    render(<Dictionary />);

    // Get the input element (textbox)
    const inputElement = screen.getByRole("textbox", { name: /search word/i });
    
    // Type a non-existent word into the input
    await userEvent.type(inputElement, "nonexistentword");
    expect(inputElement).toHaveValue("nonexistentword");

    // Get the search button and click it
    const buttonElement = screen.getByRole("button", { name: /search/i });
    await userEvent.click(buttonElement);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/word not found/i)).toBeInTheDocument(); // Adjust if your error message text is different
    });
  });

  it("mock api and display audio", async () => {
    render(<Dictionary />);
  
    const inputElement = screen.getByPlaceholderText("Enter a word");
    expect(inputElement).toBeInTheDocument();
  
    // Type 'hello' into the input
    await userEvent.type(inputElement, "hello");
    expect(inputElement).toHaveValue("hello");
  
    // Get the search button and click it
    const buttonElement = screen.getByRole("button", { name: /search/i });
    await userEvent.click(buttonElement);
  
    // Wait for the audio element to be rendered
    await waitFor(() => {
      const audioElements = screen.getAllByTestId("audio-element");
      expect(audioElements.length).toBeGreaterThan(0); // Ensure at least one audio element exists
  
      // Check the first audio element (or adjust to target a specific index)
      const audioElement = audioElements[0]; // Change index based on your requirement
      expect(audioElement).toBeInTheDocument();
  
      // Verify the source URL
      const sourceElement = audioElement.querySelector("source");
      expect(sourceElement).toHaveAttribute(
        "src",
        "https://api.dictionaryapi.dev/media/pronunciations/en/hello-au.mp3" // Adjust based on actual API response
      );
    });
  });

  beforeEach(() => {
    // Clear any session storage or reset state before each test
    sessionStorage.clear(); // This ensures that sessionStorage is empty before each test
  });

  test('should save and display favorite words', async () => {
    render(<Dictionary />);

    // Simulate typing the word 'hello' into the input field
    const input = screen.getByPlaceholderText(/Enter a word/i);
    await userEvent.type(input, 'hello');

    // Simulate clicking the search button
    await userEvent.click(screen.getByRole('button', { name: /Search/i }));

    // Ensure that 'hello' appears in the document first
    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /hello/i })).toBeInTheDocument();
    });

    // Simulate clicking the 'Save to Favorites' button
    await userEvent.click(screen.getByRole('button', { name: /Save to Favorites/i }));

    // Wait for the favorites section to update
    await waitFor(() => {
        const favoriteSection = screen.getByText(/Your Favorite Words/i);
        expect(favoriteSection).toBeInTheDocument();
    });

    // Now check for 'hello' in the favorites section directly
    const favoriteItem = await waitFor(() => 
        within(screen.getByText(/Your Favorite Words/i).parentElement).getByText("hello")
    );

    // Assert that 'hello' is found in the favorites
    expect(favoriteItem).toBeInTheDocument();
  });

  test("should remove favorite words", async () => {
    render(<Dictionary />);
  
    // Step 1: Type and search for a word (e.g., "hello")
    const input = screen.getByPlaceholderText(/Enter a word/i);
    await userEvent.type(input, "hello");
    const searchButton = screen.getByRole("button", { name: /Search/i });
    await userEvent.click(searchButton);
  
    // Step 2: Wait for the word "hello" to appear in the definition container
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /hello/i })).toBeInTheDocument();
    });
  
    // Step 3: Click the "Save to Favorites" button
    const saveToFavoritesButton = screen.getByRole("button", { name: /Save to Favorites/i });
    await userEvent.click(saveToFavoritesButton);
  
    // Step 4: Ensure the word "hello" is added to the favorites list
    const favoritesList = await screen.findByTestId("favorites-list"); // Use the test ID
    await waitFor(() => {
      expect(within(favoritesList).getByText("hello")).toBeInTheDocument();
    });
  
    // Step 5: Click the "Remove" button for the word "hello" in the favorites list
    const removeButton = within(favoritesList).getByRole("button", { name: /Remove/i });
    await userEvent.click(removeButton);
  
    // Step 6: Ensure the word "hello" is no longer in the favorites list
    await waitFor(() => {
      expect(within(favoritesList).queryByText("hello")).not.toBeInTheDocument();
    });
  });


  test("should switch between dark and light themes", async () => {
    // Step 1: Render the Dictionary component
    render(<Dictionary />);
  
    // Step 2: Check that the default theme is light
    const container = screen.getByTestId("theme-container"); // Use data-testid
    expect(container).toHaveClass("light"); // Verify that the "light" class is applied initially
  
    // Step 3: Click the theme toggle button to switch to dark theme
    const toggleButton = screen.getByRole("button", { name: /Switch to Dark Theme/i });
    await userEvent.click(toggleButton);
  
    // Step 4: Verify that the theme changes to dark
    expect(container).toHaveClass("dark");
  
    // Step 5 (Optional): Click the button again to switch back to light theme
    await userEvent.click(toggleButton);
    expect(container).toHaveClass("light"); // Verify that the theme switches back to light
  });
  
});
