import { serve } from "https://deno.land/std@0.160.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v1.12.3/mod.ts";
import * as productsService from "./services/productsService.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};


// Drag an Drop JS part

const draggables = document.querySelectorAll('.draggable');
const containers = document.querySelectorAll('.container');

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
})
});

containers.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    } 
  })
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
        return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY })
}


// Functionalities of CRUD operations

const extractProduct = async (request) => {
  const formData = await request.formData();

  const product = {
      name: formData.get("name"),
  };

  return person;
};

const deleteProducts = async (request) => {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const id = parts[2];
  await productsService.deleteById(id);

  return redirectTo("/");
};

const addProducts = async (request) => {
  const formData = await request.formData();

  const name = formData.get("name");

  await productsService.create(name);

  return redirectTo("/");
};

const listProducts = async (request) => {
  const data = {
    productsList: await productsService.findAll(),
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};

// Request handling 

const handleRequest = async (request) => {
  const url = new URL(request.url);
  if (request.method === "GET") {
    return await addProducts(request);
  } else if (request.method === "POST") {
    return await listProducts(request);
  } else if (request.method === "POST" && url.pathname === "/delete") {
    return await deleteProducts(request);
  }
  
};

serve(handleRequest, { port: 7777 });