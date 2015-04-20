Wallride.model.User = function(){
    this.fields = {
        id: new Wallride.DataTypes.Int({ label: ('ID'), required:false, visible:false, editable:false }),
        name: new Wallride.DataTypes.String({ label: ('Пользователь'), save:false, editable:false }),
        firstName: new Wallride.DataTypes.String({ label: ('Имя'), required:true, validation:[Wallride.Validator.StringNotEmpty] }),
        lastName: new Wallride.DataTypes.String({ label: ('Фамилия'), required:true, validation:[Wallride.Validator.StringNotEmpty] }),
    };

    this.initModel(this);
    return this;
};
Wallride.model.User.prototype = new Wallride.model._base();
Wallride.model.User.prototype.name ='User';



Wallride.model.Story = function(){
    this.fields = {
        id: new Wallride.DataTypes.Int({ label: 'ID', required:false, visible:false, editable:false }),
        name: new Wallride.DataTypes.String({ label: 'О чём история?', required: true }),
        description: new Wallride.DataTypes.String({ label: 'О чём история?' }),
        owner: new Wallride.DataTypes.Model({label:'Основатель', required: true, editable:false, visible:false }),
        dateStart: new Wallride.DataTypes.Date({label:'Дата начала', required: true }),
        public: new Wallride.DataTypes.Enumeration({ label: 'Доступ', required:true }),
        myMember: new Wallride.DataTypes.Model({ save:false }),
        members: new Wallride.DataTypes.Collection({  }),
    };
    
    this.fields.owner.of(Wallride.model.User);
    this.fields.myMember.of(Wallride.model.Member);
    this.fields.members.of(Wallride.model.Member);
    this.fields.public.addAvailable(0, 'Приватный');
    this.fields.public.addAvailable(1, 'Для друзей');

    console.log(this);
    this.initModel(this);
    return this;
};
Wallride.model.Story.prototype = new Wallride.model._base();
Wallride.model.Story.prototype.name ='Story';



Wallride.model.Member = function(){
    this.fields = {
        id: new Wallride.DataTypes.Int({ label: 'ID', required:false, visible:false, editable:false }),
        title: new Wallride.DataTypes.String({ label: 'Роль в истории' }),
        user: new Wallride.DataTypes.Model({label:'Участник', required: true }),
        story: new Wallride.DataTypes.Model({label:'История', required: true }),
        status: new Wallride.DataTypes.Int({ label: 'Статус', required:true }),
    };
    
    this.fields.user.of(Wallride.model.User);
    this.fields.story.of(Wallride.model.Story);

    this.initModel(this);
    return this;
};
Wallride.model.Member.prototype = new Wallride.model._base();
Wallride.model.Member.prototype.name ='Member';
Wallride.model.Member.prototype.getName = function(){
    return this.F.title.val() ? this.F.title : this.F.user.valueModel.F.name;
};



