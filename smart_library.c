#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Book {
    int id;
    char title[100], author[100];
    int year, isIssued;
    char studentName[100], studentUsn[20];
    struct Book *prev,*next;
} Book;

Book *head=NULL;

void input(char *msg,char *b){
    printf("%s",msg);
    fgets(b,100,stdin);
    b[strcspn(b,"\n")]=0;
}

Book* create(int id,char *t,char *a,int y){
    Book *n=malloc(sizeof(Book));
    n->id=id; strcpy(n->title,t); strcpy(n->author,a);
    n->year=y; n->isIssued=0;
    n->studentName[0]=n->studentUsn[0]=0;
    n->next=n->prev=NULL;
    return n;
}

void insert(Book *n){
    if(!head){ head=n; n->next=n->prev=n; }
    else{
        Book *t=head->prev;
        t->next=n; n->prev=t; n->next=head; head->prev=n;
    }
}

void display(){
    if(!head){ printf("Empty\n"); return; }
    Book *t=head;
    do{
        printf("%d %s %s %d %s\n",t->id,t->title,t->author,t->year,
        t->isIssued?"Issued":"Available");
        t=t->next;
    }while(t!=head);
}

int main(){
    int ch,id,y; char t[100],a[100];
    do{
        printf("1.Add 2.Display 0.Exit:");
        scanf("%d",&ch); getchar();
        if(ch==1){
            printf("ID:"); scanf("%d",&id); getchar();
            input("Title:",t); input("Author:",a);
            printf("Year:"); scanf("%d",&y); getchar();
            insert(create(id,t,a,y));
        }
        else if(ch==2) display();
    }while(ch!=0);
    return 0;
}