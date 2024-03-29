## <span style="color:red">*Выделение и управление памятью*</span>

#### malloc, calloc, realloc, alloca

1. malloc: запросить указанное количество байтов памяти. Начальное значение в запрошенной памяти неопределенно.
2. calloc: для объекта указанной длины выделить память, которая может содержать указанное количество объектов. Каждый
   бит запрошенной памяти инициализируется на 0.
3. realloc: изменить длину ранее выделенной памяти (увеличить или уменьшить). При увеличении длины может потребоваться
   перемещение содержимого ранее выделенной области в другую достаточно большую область, при этом начальное значение в
   новой добавленной области неопределенно.
4. alloca: запросить память на стеке. Когда программа выходит из стека, она автоматически освобождает память. Однако
   следует отметить, что alloca не является переносимой и сложной для реализации на машинах без традиционных стеков.
   alloca не следует использовать в программах, которые должны быть широко портированы. C99 поддерживает массивы
   переменной длины (VLAs) и может использоваться вместо alloca.

#### malloc, free

Используются для выделения и освобождения памяти

Использование malloc, free

Запросить память и подтвердить успешность заявки

```c++
char *str = (char*) malloc(100);
assert(str != nullptr);
```

Указатель пуст после освобождения памяти

```c++
free(p); 
p = nullptr;
```

#### new、delete

1. new / new []: делают две вещи, сначала вызывают malloc на нижнем уровне для выделения памяти, а затем вызывают
   конструктор (создают объект).
2. delete / delete []: также выполняют две вещи, сначала вызывают деструктор (очищают ресурсы), а затем вызывают free на
   нижнем уровне для освобождения пространства.
3. new автоматически вычисляет количество требуемых байтов при запросе памяти, а malloc требует от нас ввода количества
   байтов запрошенного пространства памяти.

Демонстрация new, delete

Запросить память и подтвердить успешность заявки

```c++
int main()
{
    T* t = new T();     // сначала выделение памяти, затем конструктор
    delete t;           // сначала деструктор, затем освобождение памяти
    return 0;
}
```

#### Позиционированный new

Позиционированный new (placement new) позволяет нам передавать дополнительные адресные параметры в new для создания
объектов в заранее указанной области памяти.

```c++
new (place_address) type
new (place_address) type (initializers)
new (place_address) type [size]
new (place_address) type [size] { braced initializer list }
```

* `place_address` - это указатель
* `initializers` предоставляет (возможно, пустой) список начальных значений, разделенных запятыми

### delete this - это законно?

> [Законно ли (и морально) для функции-члена сказать delete this?](https://isocpp.org/wiki/faq/freestore-mgmt#delete-this)

Законно, но:

1. Должно быть гарантировано, что этот объект выделен через `new` (не `new[]`, не позиционированный new, не на стеке, не
   глобальный, не член других объектов)
2. Вы должны гарантировать, что функция-член, которая вызывает delete this, является последней функцией-членом, которая
   вызывает this
3. Вы должны гарантировать, что функция-член не вызывает this после `delete this`
4. Убедитесь, что никто не использует его после delete this

### Как определить класс, который может генерировать объекты только на куче (на стеке)?

> [Как определить класс, который может генерировать объекты только на куче (на стеке)?](https://www.nowcoder.com/questionTerminal/0a584aa13f804f3ea72b442a065a7618)

#### Только на куче

Метод: Сделать деструктор приватным

Причина: C ++ - это язык со статической привязкой. Компилятор управляет жизненным циклом объектов на стеке. Когда
компилятор выделяет стековое пространство для объектов класса, он сначала проверяет доступность деструктора класса. Если
деструктор недоступен, объект не может быть создан на стеке.

#### Только на стеке

Метод: перегрузить new и delete как private

Причина: Объект генерируется на куче с использованием операции new. Процесс делится на два этапа: на первом этапе
используется new для поиска доступной памяти на куче и выделения ее объекту; на втором этапе вызывается конструктор для
создания объекта. Установив операцию new в private, первый этап не может быть завершен, и объекты не могут быть
сгенерированы на куче.

### Умный указатель

#### В стандартной библиотеке C ++ (STL)

файл заголовка：`#include <memory>`

#### C++ 98

```c++
std::auto_ptr<std::string> ps (new std::string(str))；
```

#### C++ 11

1. shared_ptr
2. unique_ptr
3. weak_ptr
4. auto_ptr (Устарел в C ++ 11)

* Класс shared_ptr реализует концепцию совместного владения. Несколько умных указателей указывают на один и тот же
  объект, и этот объект и его связанные ресурсы освобождаются, когда "последняя ссылка уничтожается". Для выполнения
  вышеуказанной работы в более сложных сценариях стандартная библиотека предоставляет вспомогательные классы, такие как
  weak_ptr, bad_weak_ptr и enable_shared_from_this.
* Класс unique_ptr реализует концепцию исключительного владения или строгого владения, обеспечивая, чтобы только один
  умный указатель мог указывать на объект в одно и то же время. Вы можете передать владение. Это особенно полезно для
  избежания утечек ресурсов, таких как забывание удалить после new.

##### shared_ptr

Несколько умных указателей могут делить один и тот же объект, и последний из объектов имеет обязанность уничтожить
объект и очистить все ресурсы, связанные с объектом.

* Поддержка пользовательского удалителя, которая может предотвратить проблемы Cross-DLL (объект создается с помощью new
  в динамической библиотеке ссылок (DLL), но удаляется другой DLL), и мьютекс автоматически освобождается

##### weak_ptr

weak_ptr позволяет вам делиться, но не владеть объектом. Как только последний умный указатель, который владеет объектом,
теряет владение, любой weak_ptr автоматически становится пустым. Поэтому, в дополнение к конструкторам по умолчанию и
копированию, weak_ptr предоставляет только конструктор "принять shared_ptr".

* Проблема циклов ссылок (два объекта, которые не использовались, фактически ссылаются друг на друга, заставляя их
  появляться в состоянии "использовано")

##### unique_ptr

`unique_ptr` - это тип, который стал доступен только с `C ++ 11`, и это умный указатель, который может помочь избежать
утечек ресурсов во время исключений. Используя исключительное владение, вы можете гарантировать, что объект и его
соответствующий ресурс принадлежат только одному указателю в одно и то же время. Как только вы уничтожите владение или
запрограммируете пустоту, или начнете владеть другим объектом, ранее владеемый объект будет уничтожен, и любые
соответствующие ресурсы будут освобождены.

* unique_ptr используется вместо auto_ptr

##### auto_ptr

Устарел в c ++ 11 из-за отсутствия языковых функций, таких как семантика `std::move` "для конструирования и
присваивания", и других недостатков.

##### Сравнение auto_ptr и unique_ptr

* auto_ptr может быть присвоен копия, и владение передается после копирования; unqiue_ptr не имеет семантики
  присваивания копий, но реализует семантику `move`;
* объекты auto_ptr не могут управлять массивами (разрушительный вызов `delete`), unique_ptr может управлять массивами (
  разрушительный вызов` delete [] `);

### Оператор приведения типов

> [MSDN. Оператор приведения типов](https://msdn.microsoft.com/zh-CN/library/5f6c9f8h.aspx)

#### static_cast

* Для неполиморфных преобразований
* Не выполняет проверку типа во время выполнения (безопасность преобразования не так хороша, как у dynamic_cast)
* Обычно используется для преобразования числовых типов данных (например, float-> int)
* Вы можете перемещать указатель по всей иерархии классов. Это безопасно (восходящее преобразование) для преобразования
  дочернего класса в родительский класс, и это не безопасно для преобразования родительского класса в дочерний класс (
  потому что в дочернем классе могут быть поля или методы, которых нет в родительском классе)

> Восходящее приведение является неявным преобразованием.

#### dynamic_cast

* Для полиморфных преобразований типов
* Выполняет проверку типа во время выполнения
* Применим только к указателям или ссылкам
* Преобразование неоднозначных указателей будет неудачным (вернет nullptr), но исключение не будет выброшено
* Вы можете перемещать указатель по всей иерархии классов, включая восходящее преобразование, нисходящее преобразование

#### const_cast

* Используется для удаления const, volatile и __unaligned свойств (например, преобразование const int в int)

#### reinterpret_cast

* Простое переинтерпретация для битов
* Неправильное использование оператора reinterpret_cast может быть очень рискованным. Если требуемое преобразование само
  по себе не является низкоуровневым, вы должны использовать один из других операторов приведения.
* Позволяет преобразование любого указателя в любой другой тип указателя (например, `char *` в `int *` или `One_class *`
  в `Unrelated_class *`, но само по себе это не безопасно)
* Также позволяет преобразование любого целочисленного типа в любой тип указателя и обратное преобразование.
* Оператор reinterpret_cast не может потерять const, volatile или __unaligned атрибуты.
* Практическое использование reinterpret_cast находится в хеш-функции, которая предназначена для отображения значений на
  индексы, делая два разных значения едва кончаются с тем же индексом.

#### bad_cast

* Оператор dynamic_cast выбрасывает исключение bad_cast, потому что приведение к ссылочному типу не удалось.

Демонстрация bad_cast

```c++
try {  
    Circle& ref_circle = dynamic_cast<Circle&>(ref_shape);   
}  
catch (bad_cast b) {  
    cout << "Caught: " << b.what();  
} 
```

### Информация о типе во время выполнения (RTTI)

#### dynamic_cast

* Для полиморфных преобразований типов

#### typeid

* Оператор typeid позволяет определить тип объекта во время выполнения
* type \ _id возвращает ссылку на объект type \ _info
* Если вы хотите получить тип данных производного класса через указатель базового класса, базовый класс должен иметь
  виртуальную функцию
* Может получить только фактический тип объекта

#### type_info

* Класс type_info описывает информацию о типе, генерируемую компилятором в программе. Объекты этого класса могут
  эффективно хранить указатели на имена типов. Класс type_info также может хранить закодированные значения, подходящие
  для сравнения, равны ли два типа, или сравнения их порядка перестановки. Правила кодирования и порядок перестановки
  для типов не указаны и могут варьироваться от программы к программе.
* Файл заголовка: `typeinfo`

Демонстрация typeid, type_info

```c++
#include <iostream>
using namespace std;

class Flyable                       // может летать
{
public:
    virtual void takeoff() = 0;     // взлететь
    virtual void land() = 0;        // приземлиться
};
class Bird : public Flyable         // птица
{
public:
    void foraging() {...}           // добывать пищу
    virtual void takeoff() {...}
    virtual void land() {...}
    virtual ~Bird(){}
};
class Plane : public Flyable        // самолет
{
public:
    void carry() {...}              // перевозить
    virtual void takeoff() {...}
    virtual void land() {...}
};

class type_info
{
public:
    const char* name() const;
    bool operator == (const type_info & rhs) const;
    bool operator != (const type_info & rhs) const;
    int before(const type_info & rhs) const;
    virtual ~type_info();
private:
    ...
};

void doSomething(Flyable *obj)                 // делать что-то
{
    obj->takeoff();

    cout << typeid(*obj).name() << endl;        // вывод типа входящего объекта（"class Bird" или "class Plane"）

    if(typeid(*obj) == typeid(Bird))            // определение типа объекта
    {
        Bird *bird = dynamic_cast<Bird *>(obj); // преобразование объекта
        bird->foraging();
    }

    obj->land();
}

int main(){
	Bird *b = new Bird();
	doSomething(b);
	delete b;
	b = nullptr;
	return 0;
}
```
