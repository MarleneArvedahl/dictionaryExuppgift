import { test, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { setupServer } from 'msw/node'; 
//@ts-ignore
import { http, HttpResponse } from 'msw';
import mockWords from './mockWords.json'; 
import userEvent from '@testing-library/user-event';

//before all och after all hör ihop med mockning msw. Det betyder att man startar servern före alla test och stängs efter alla test.
beforeAll(() => server.listen());

afterAll(() => server.close());

const server = setupServer(
    http.get(`https://api.dictionaryapi.dev/api/v2/entries/en/hello`, () =>
        HttpResponse.json(mockWords)
    )
);

//start-test för att se att testningen funkar och är igång.
test('True to be true', () => {
    expect(true).toBe(true);
});

test('should render the correct header', () => {
    render(<App />);
    expect(screen.getByText('Dictionary')).toBeInTheDocument();
});

//Här testar jag att det sökta ordet dyker upp på skärmen och samtidigt att knappen fungerar.
test('should display the searched word after submission via click', async () => {
    render(<App />);
    const user = userEvent.setup();

    await waitFor(() =>
        expect(screen.queryByText('Loading..')).not.toBeInTheDocument()
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');
    const searchButton = screen.getByRole('button', { name: /slå upp ord/i });
    await user.click(searchButton);
   
    await waitFor(() =>
        expect(screen.queryByText('"hello"')).toBeInTheDocument()
  );
  //här kollar jag att ljudfilen renderas ut då den dyker upp tillsammans med texten "Lyssna på uttal".
    expect(screen.queryByText("Lyssna på uttal")).toBeInTheDocument()

    //Här testar jag att fylla i ett ord som inte finns med i api:et, att det går att söka med en enter-tryckning samt att felmeddelandet visas.
    await user.type(input, "ostkaka{Enter}");  
    expect(input).toHaveTextContent("");
    await waitFor(() =>
      expect(screen.queryByText("Ditt ord gav tyvärr ingen träff, var god fyll i ett annat")).toBeInTheDocument()
  );
});
