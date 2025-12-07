#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Book {
    int id;
    char title[100];
    char author[100];
    int year;
    int isIssued;              // 0 = available, 1 = issued

    // Student details (only when issued)
    char studentName[100];
    char studentUsn[20];

    struct Book *prev;
    struct Book *next;
} Book;

Book *head = NULL;

// --------- Helper Functions ----------

void inputString(const char *prompt, char *buffer, int size) {
    printf("%s", prompt);
    fgets(buffer, size, stdin);
    size_t len = strlen(buffer);
    if (len > 0 && buffer[len - 1] == '\n')
        buffer[len - 1] = '\0';
}

Book* createBookNode(int id, const char *title, const char *author, int year) {
    Book *newNode = (Book*)malloc(sizeof(Book));
    if (!newNode) {
        printf("Memory allocation failed!\n");
        return NULL;
    }

    newNode->id = id;
    strncpy(newNode->title, title, sizeof(newNode->title) - 1);
    strncpy(newNode->author, author, sizeof(newNode->author) - 1);
    newNode->title[sizeof(newNode->title) - 1] = '\0';
    newNode->author[sizeof(newNode->author) - 1] = '\0';

    newNode->year = year;
    newNode->isIssued = 0;
    newNode->studentName[0] = '\0';
    newNode->studentUsn[0]  = '\0';

    newNode->prev = newNode->next = NULL;
    return newNode;
}

// Insert into Doubly Circular Linked List
void insertBook(Book *newNode) {
    if (!newNode) return;

    if (head == NULL) {
        head = newNode;
        head->next = head;
        head->prev = head;
    } else {
        Book *tail = head->prev;
        tail->next = newNode;
        newNode->prev = tail;
        newNode->next = head;
        head->prev = newNode;
    }
    printf("Book added successfully!\n");
}

int isEmpty() {
    return head == NULL;
}

void printBook(Book *b) {
    printf("ID: %d | Title: %s | Author: %s | Year: %d\n",
           b->id, b->title, b->author, b->year);

    if (b->isIssued)
        printf("Status: Issued to %s (USN: %s)\n",
               b->studentName, b->studentUsn);
    else
        printf("Status: Available\n");

    printf("--------------------------------------\n");
}

// --------- Core Operations ----------

void addBook() {
    int id, year;
    char title[100], author[100];

    printf("Enter Book ID: ");
    scanf("%d", &id);
    while (getchar() != '\n');

    inputString("Enter Title: ", title, sizeof(title));
    inputString("Enter Author: ", author, sizeof(author));

    printf("Enter Year: ");
    scanf("%d", &year);
    while (getchar() != '\n');

    insertBook(createBookNode(id, title, author, year));
}

void displayBooks() {
    if (isEmpty()) {
        printf("Library is empty.\n");
        return;
    }

    Book *temp = head;
    printf("\n--- Library Books ---\n");
    do {
        printBook(temp);
        temp = temp->next;
    } while (temp != head);
}

Book* searchById(int id) {
    if (isEmpty()) return NULL;
    Book *temp = head;
    do {
        if (temp->id == id) return temp;
        temp = temp->next;
    } while (temp != head);
    return NULL;
}

void searchBook() {
    int id;
    printf("Enter Book ID to search: ");
    scanf("%d", &id);
    while (getchar() != '\n');

    Book *b = searchById(id);
    if (b) printBook(b);
    else printf("Book not found.\n");
}

void deleteBook() {
    int id;
    printf("Enter Book ID to delete: ");
    scanf("%d", &id);
    while (getchar() != '\n');

    Book *b = searchById(id);
    if (!b) {
        printf("Book not found.\n");
        return;
    }

    if (b->next == b)
        head = NULL;
    else {
        b->prev->next = b->next;
        b->next->prev = b->prev;
        if (b == head) head = b->next;
    }
    free(b);
    printf("Book deleted successfully.\n");
}

void issueBook() {
    int id;
    printf("Enter Book ID to issue: ");
    scanf("%d", &id);
    while (getchar() != '\n');

    Book *b = searchById(id);
    if (!b || b->isIssued) {
        printf("Invalid issue operation.\n");
        return;
    }

    inputString("Enter Student Name: ", b->studentName, sizeof(b->studentName));
    inputString("Enter Student USN: ", b->studentUsn, sizeof(b->studentUsn));
    b->isIssued = 1;

    printf("Book issued successfully.\n");
}

void returnBook() {
    int id;
    printf("Enter Book ID to return: ");
    scanf("%d", &id);
    while (getchar() != '\n');

    Book *b = searchById(id);
    if (!b || !b->isIssued) {
        printf("Invalid return operation.\n");
        return;
    }

    b->isIssued = 0;
    b->studentName[0] = '\0';
    b->studentUsn[0]  = '\0';
    printf("Book returned successfully.\n");
}

// --------- Menu ----------

void showMenu() {
    printf("\n===== SMART LIBRARY MANAGEMENT SYSTEM =====\n");
    printf("1. Add Book\n");
    printf("2. Display Books\n");
    printf("3. Search Book by ID\n");
    printf("4. Delete Book\n");
    printf("5. Issue Book\n");
    printf("6. Return Book\n");
    printf("0. Exit\n");
    printf("Enter choice: ");
}

int main() {
    int choice;
    do {
        showMenu();
        scanf("%d", &choice);
        while (getchar() != '\n');

        switch (choice) {
            case 1: addBook(); break;
            case 2: displayBooks(); break;
            case 3: searchBook(); break;
            case 4: deleteBook(); break;
            case 5: issueBook(); break;
            case 6: returnBook(); break;
            case 0: printf("Exiting program...\n"); break;
            default: printf("Invalid choice!\n");
        }
    } while (choice != 0);

    return 0;
}